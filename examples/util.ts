import sharp from 'sharp';
import { simpleWalkChaosLinePlot, simpleWalkChaosPlot } from '../ifs/chaos-game';
import { plotFlame, plotFlameWithColorStealing, makeMixedColorSteal, iterateFlamePoint } from '../ifs/fractal-flame';
import { makeIdentityFunction } from '../transform';
import { applyContrastBasedScalefactor, applyLinearScalefactor, mixColorLinear } from '../utils/color';
import { add, complex, mul } from '../utils/complex';
import { BI_UNIT_DOMAIN, scaleDomain } from '../utils/domain';
import { performClahe } from '../effects/clahe';
import { forEachPixel, mapPixelToDomain, saveImageBuffer, readImage, normalizeBuffer, saveImage, mapDomainToPixel, createImage, fillPicture, mapComplexDomainToPixel, mapPixelToComplexDomain } from '../utils/picture';
import { withinPolygon } from '../utils/polygon';
import { randomComplex, randomIntegerWeighted } from '../utils/random';
import { expandPalette, getBigQualitativePalette, MAVERICK } from '../utils/palette';
import { estimateAttractorDomain } from '../attractors/plot';
import { downscale, downscale2 } from '../utils/downscale';
import { plotVectorField, DefaultGridShuffle } from '../vector-field/vector-field';
import { plot2dAutomaton } from '../automata/cellular/2d-automaton';
import { drawBresenhamLine, drawFilledCircle, drawFilledNgon } from '../utils/raster';
import { makeDihedralSymmetry } from '../utils/symmetry';
import { Attractor, CellularAutomataGrid, Color, ColorMapFunction, ColorSteal, ComplexPlotter, ComplexToColorFunction, ComplexToComplexFunction, Ifs, IterableComplexFunction, IterableRealFunction, Next1dCellStateFunction, Next2dCellStateFunction, NoiseFunction2D, Optional, PixelPlotter, PlotDomain, Polygon, Transform2D, VectorFieldColorFunction, VectorFieldFunction, VectorFieldTimeFunction, Wrapper } from '../utils/types';
import { makeInvertCollageHorizontal } from '../symmetry/color-reversing-wallpaper-group';
import { plot1dAutomaton } from '../automata/cellular/1d-automaton';
import { makeMappedZPlotter, makePlotter } from '../utils/plotter';
import { makeSvgDocument, saveSvgToFile, SvgDocument } from '../utils/canvas-svg';

export const plotFunctionBuffer = (width: number, height: number, f: ComplexToColorFunction, domain = BI_UNIT_DOMAIN, colorfunc?: ColorMapFunction, normalize = true): Float32Array => {
  const buffer = new Float32Array(width * height * 4);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const [ x, y ] = mapPixelToDomain(i, j, width, height, domain);

      const idx = (i + j * width) * 4;
      const color = f(complex(x, y));
      if (typeof color === "number") {
        buffer[idx + 0] = color;
        buffer[idx + 1] = color;
        buffer[idx + 2] = color;
        buffer[idx + 3] = 1;
      } else {
        buffer[idx + 0] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
        buffer[idx + 3] = 1;
      }
    }
  }

  if (colorfunc != null) {
    if (normalize) {
      normalizeBuffer(buffer, width, height);
    }

    forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
      const color = colorfunc(r);
      buffer[idx + 0] = color[0];
      buffer[idx + 1] = color[1];
      buffer[idx + 2] = color[2];
      buffer[idx + 3] = 1;
    });
  }

  return buffer;
};

export const plotFunction = (path: string, width: number, height: number, f: ComplexToColorFunction, domain = BI_UNIT_DOMAIN, colorfunc?: ColorMapFunction, normalize = true): void => {
  const buffer = plotFunctionBuffer(width, height, f, domain, colorfunc, normalize);
  saveImageBuffer(buffer, width, height, path);
};

export const plotFunctionClahe = (path: string, width: number, height: number, f: ComplexToColorFunction, domain = BI_UNIT_DOMAIN, colorfunc: ColorMapFunction, normalize = true): void => {
  const buffer = plotFunctionBuffer(width, height, f, domain, colorfunc, normalize);
  const claheCorrected = performClahe(buffer, width, height, new Float32Array(width * height * 4), 16, 16, 256, 128);
  saveImageBuffer(claheCorrected, width, height, path);
};

export const plotWalk = (path: string, width: number, height: number, walk: IterableComplexFunction, domain = BI_UNIT_DOMAIN, nbIterations = 10000): void => {
  const buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  const hitmap = new Uint32Array(width * height).fill(0);
  simpleWalkChaosPlot(buffer, hitmap, width, height, walk, null, domain, nbIterations);
  const corrected = applyLinearScalefactor(buffer, hitmap, width, height);
  saveImageBuffer(corrected, width, height, path);
};

export const plotWalkLine = (path: string, width: number, height: number, walk: IterableComplexFunction, domain = BI_UNIT_DOMAIN, nbIterations = 1000): void => {
  const buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  simpleWalkChaosLinePlot(buffer, width, height, walk, domain, nbIterations);
  saveImageBuffer(buffer, width, height, path);
};

export const plotWalkClahe = (path: string, width: number, height: number, walk: IterableComplexFunction, domain = BI_UNIT_DOMAIN, nbIterations = 10000): void => {
  const buffer = new Float32Array(width * height * 4);
  const hitmap = new Uint32Array(width * height).fill(0);

  simpleWalkChaosPlot(buffer, hitmap, width, height, walk, null, domain, nbIterations);

  const corrected = applyLinearScalefactor(buffer, hitmap, width, height);
  const claheCorrected = performClahe(corrected, width, height, new Float32Array(width * height * 4), 16, 16, 256, 4);
  saveImageBuffer(claheCorrected, width, height, path);
};

export const plotPolygon = (path: string, width: number, height: number, polygon: Polygon, domain = BI_UNIT_DOMAIN, nbIterations = 10000): void => {
  const buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);

  const walk = () => {
    let zn = randomComplex();
    while (withinPolygon(zn, polygon) === false) {
      zn = randomComplex();
    }
    return zn;
  };

  const hitmap = new Uint32Array(width * height).fill(0);
  simpleWalkChaosPlot(buffer, hitmap, width, height, walk, null, domain, nbIterations);
  saveImageBuffer(buffer, width, height, path);
};

export const plotIfsFlame = (
  path: string,
  width: number,
  height: number,
  transforms: Transform2D[],
  randomInt: IterableRealFunction,
  colors: Color[],
  initialPointPicker = randomComplex,
  finalTransform = makeIdentityFunction(),
  nbPoints = 1000,
  nbIterations = 10000,
  domain = BI_UNIT_DOMAIN,
  resetIfOverflow = false,
  colorMerge = mixColorLinear,
  additiveColors = true,
  wrapPlotter?: Wrapper<ComplexPlotter>,
): void => {
  // we create a buffer and a custom plotter for storing the hitmap
  let buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  const hitmap = new Uint32Array(width * height).fill(0);
  let plotter = makeAdditiveHitmapZPlotter(buffer, hitmap, width, height, domain);
  if (additiveColors === false) {
    plotter = makeHitmapZPlotter(buffer, hitmap, width, height, domain);
  }
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  plotFlame(transforms, randomInt, colors, plotter, initialPointPicker, finalTransform, nbPoints, nbIterations, resetIfOverflow, colorMerge);

  // we correct the generated image using the contrast-based scalefactor technique
  if (additiveColors) {
    // const averageHits = Math.max(1, (nbPoints * nbIterations) / (width * height));
    const averageHits = getAverageHits(hitmap, width, height);
    buffer = applyContrastBasedScalefactor(buffer, hitmap, width, height, averageHits);
    // buffer = applyLinearScalefactor(buffer, width, height);
    // buffer = applyLogScalefactor(buffer, hitmap, width, height);
  }

  // and finally save the image
  saveImageBuffer(buffer, width, height, path);
};

export const plotIfs = (
  path: string,
  width: number,
  height: number,
  ifs: Ifs,
  nbPoints = 1000,
  nbIterations = 10000,
  finalTransform = makeIdentityFunction(),
  domain = BI_UNIT_DOMAIN,
  initialPointPicker = randomComplex,
  colors?: Optional<Color[]>,
  wrapPlotter?: Wrapper<ComplexPlotter>,
): void => {
  const transforms = ifs.functions;
  const randomInt = randomIntegerWeighted(ifs.probabilities);

  if (colors == null) {
    colors = expandPalette(getBigQualitativePalette(5), transforms.length);
  }

  let buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  const hitmap = new Uint32Array(width * height).fill(0);
  let plotter = makeAdditiveHitmapZPlotter(buffer, hitmap, width, height, domain);
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  plotFlame(transforms, randomInt, colors, plotter, initialPointPicker, finalTransform, nbPoints, nbIterations);

  // we correct the generated image using the contrast-based scalefactor technique
  const averageHits = getAverageHits(hitmap, width, height);
  buffer = applyContrastBasedScalefactor(buffer, hitmap, width, height, averageHits);

  // and finally save the image
  saveImageBuffer(buffer, width, height, path);
};

export const plotIfsGrid = (
  path: string,
  width: number,
  height: number,
  ifs: Ifs,
  nbIterations = 10000,
  finalTransform = makeIdentityFunction(),
  domain = BI_UNIT_DOMAIN,
  mappedDomain = BI_UNIT_DOMAIN,
  accuracy = 1,
  colors?: Optional<Color[]>,
  wrapPlotter?: Wrapper<ComplexPlotter>,
): void => {
  const transforms = ifs.functions;
  const randomInt = randomIntegerWeighted(ifs.probabilities);

  if (colors == null) {
    colors = expandPalette(getBigQualitativePalette(5), transforms.length);
  }

  let buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  const hitmap = new Uint32Array(width * height).fill(0);
  let plotter = makeAdditiveHitmapZPlotter(buffer, hitmap, width, height, domain);
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  for (let i = 0; i < width * accuracy; i++) {
    for (let j = 0; j < height * accuracy; j++) {
      const [ x, y ] = mapPixelToDomain(i / accuracy, j / accuracy, width, height, mappedDomain);
      iterateFlamePoint(complex(x, y), transforms, randomInt, colors, plotter, finalTransform, nbIterations);
    }
  }

  // we correct the generated image using the contrast-based scalefactor technique
  const averageHits = getAverageHits(hitmap, width, height);
  buffer = applyContrastBasedScalefactor(buffer, hitmap, width, height, averageHits);

  // and finally save the image
  saveImageBuffer(buffer, width, height, path);
};

export const plotNoise = (noiseFunction: () => Float32Array, size: number, outputPath: string): void => {
  const noise = noiseFunction();
  saveImageBuffer(noise, size, size, outputPath);
};

export const plotNoiseFunction = (noiseFunction: NoiseFunction2D, size: number, outputPath: string, normalize = true): Float32Array => {
  const buffer = fillPicture(new Float32Array(size * size * 4), 0, 0, 0, 1);
  forEachPixel(buffer, size, size, (r, g, b, a, i, j, idx) => {
    const intensity = noiseFunction(i / size, j / size);
    buffer[idx + 0] = intensity;
    buffer[idx + 1] = intensity;
    buffer[idx + 2] = intensity;
    buffer[idx + 3] = a;
  });
  if (normalize) {
    normalizeBuffer(buffer, size, size);
  }
  saveImageBuffer(buffer, size, size, outputPath);
  return buffer;
};

export const plotAttractor = (
  path: string,
  width: number,
  height: number,
  attractor: Attractor,
  initialPointPicker = () => complex(0, 0),
  colorFunc: ColorSteal = () => [ 1, 1, 1, 1 ],
  nbIterations = 1000000,
  domain = BI_UNIT_DOMAIN,
  wrapPlotter?: Wrapper<ComplexPlotter>,
): void => {
  plotAttractorMultipoint(path, width, height, attractor, initialPointPicker, colorFunc, 1, nbIterations, domain, wrapPlotter);
};

export const plotAttractorMultipoint = (
  path: string,
  width: number,
  height: number,
  attractor: Attractor,
  initialPointPicker = () => complex(0, 0),
  colorFunc: ColorSteal = () => [ 1, 1, 1, 1 ],
  nbPoints = 10,
  nbIterations = 1000000,
  domain = BI_UNIT_DOMAIN,
  wrapPlotter?: Wrapper<ComplexPlotter>,
): void => {
  // we create a buffer and the standard plotter
  let buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  const hitmap = new Uint32Array(width * height).fill(0);
  let plotter = makeAdditiveHitmapZPlotter(buffer, hitmap, width, height, domain);

  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  plotFlameWithColorStealing([ attractor ], () => 0, colorFunc, plotter, false, initialPointPicker, makeIdentityFunction(), nbPoints, nbIterations);

  // we correct the generated image using the contrast-based scalefactor technique
  const averageHits = getAverageHits(hitmap, width, height);
  buffer = applyContrastBasedScalefactor(buffer, hitmap, width, height, averageHits);

  // and finally save the image
  saveImageBuffer(buffer, width, height, path);
};

export const plotAutoscaledAttractor = (
  path: string,
  width: number,
  height: number,
  attractor: Attractor,
  initialPointPicker = () => complex(0, 0),
  palette = MAVERICK,
  nbIterations = 1000000,
  autoScaleIterations = 100000,
  zoomAfterAutoscale = 1.2,
): void => {
  // we compute automatically the domain of the attractor
  const domain = scaleDomain(estimateAttractorDomain(attractor, initialPointPicker, makeIdentityFunction(), autoScaleIterations), zoomAfterAutoscale);
  console.log('Estimated domain', domain);

  // we create a color function that will apply the palette depending on the location of the point and the number of iterations
  const colorFunc = makeMixedColorSteal(palette, domain.xmax / 2, nbIterations, 0.5, 0.5);

  // and we plot
  plotAttractor(path, width, height, attractor, initialPointPicker, colorFunc, nbIterations, domain);
};

export const plotSupersampledVectorField = (
  path: string,
  width: number,
  height: number,
  vectorFunction: VectorFieldFunction,
  colorFunc: VectorFieldColorFunction,
  timeFunction: VectorFieldTimeFunction = () => 0,
  nbIterations = 500,
  finalTransform = makeIdentityFunction(),
  wrapPlotter?: Optional<Wrapper<ComplexPlotter>>,
  supersampling = 4,
  domainScale = 2,
): void => {
  const superWidth = supersampling * width;
  const superHeight = supersampling * height;

  let buffer = fillPicture(new Float32Array(superWidth * superHeight * 4), 0, 0, 0, 1);
  let plotter = makeMappedZPlotter(buffer, superWidth, superHeight, scaleDomain(BI_UNIT_DOMAIN, domainScale));
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  plotVectorField(vectorFunction, colorFunc, plotter, timeFunction, finalTransform, 0.025, BI_UNIT_DOMAIN, DefaultGridShuffle, 0.01, nbIterations);

  // downscale from the super size to the requested size
  buffer = downscale2(buffer, superWidth, superHeight, width, height);

  // and finally save the image
  saveImageBuffer(buffer, width, height, path);
};

export const plotVectorFieldVectors = (
  path: string,
  vectorFunction: VectorFieldFunction,
  colorFunc: VectorFieldColorFunction,
  iteration = 0,
  time = 0,
  gridAccuracy = 0.025,
  gridDomain = BI_UNIT_DOMAIN,
  halfCellSize = 10,
): void => {
  const cellSize = 2 * halfCellSize + 1;
  const width = cellSize * Math.ceil((gridDomain.xmax - gridDomain.xmin) / gridAccuracy);
  const height = cellSize * Math.ceil((gridDomain.ymax - gridDomain.ymin) / gridAccuracy);

  const buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  const plotter = makePlotter(buffer, width, height);

  let point = 0;
  for (let x = gridDomain.xmin; x <= gridDomain.xmax; x += gridAccuracy) {
    for (let y = gridDomain.ymin; y <= gridDomain.ymax; y += gridAccuracy) {
      const z = complex(x, y);
      const fz = add(mapComplexDomainToPixel(z, gridDomain, width, height), complex(halfCellSize, halfCellSize));
      const v = mul(vectorFunction(z, iteration, time), halfCellSize);
      const color = colorFunc(z, point, iteration, z);
      drawBresenhamLine(fz.re, fz.im, fz.re + v.re, fz.im + v.im, color, plotter);
      drawFilledCircle(fz.re, fz.im, 2, color, plotter);
      point++;
    }
  }

  saveImageBuffer(buffer, width, height, path);
};

export const plotVectorFieldVectors2 = (
  path: string,
  vectors: Float32Array,
  width: number,
  height: number,
  colorFunc: VectorFieldColorFunction,
  halfCellSize = 10,
): void => {
  const cellSize = 2 * halfCellSize + 1;

  const outWidth = width * cellSize;
  const outHeight = height * cellSize;
  const buffer = fillPicture(new Float32Array(outWidth * outHeight * 4), 0, 0, 0, 1);
  const plotter = makePlotter(buffer, outWidth, outHeight);

  let point = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const fz = add(mul(complex(x, y), cellSize), complex(halfCellSize + 1, halfCellSize + 1));
      const v = mul(complex(vectors[(x + y * width) * 2], vectors[(x + y * width) * 2 + 1]), halfCellSize);
      const z = mapPixelToComplexDomain(x, y, width, height, BI_UNIT_DOMAIN);
      const color = colorFunc(z, point, 0, z);
      drawBresenhamLine(fz.re, fz.im, fz.re + v.re, fz.im + v.im, color, plotter);
      drawFilledCircle(fz.re, fz.im, 2, color, plotter);
      point++;
    }
  }

  saveImageBuffer(buffer, outWidth, outHeight, path);
};


export const downsampleImage = (inputPath: string, outputPath: string, factor = 1): void => {
  const inputImage = readImage(inputPath);

  const downscaleFactor = 1 / factor;
  const outputWidth = Math.trunc(downscaleFactor * inputImage.width);
  const outputHeight = Math.trunc(downscaleFactor * inputImage.height);

  const resizedBuffer = downscale(inputImage.buffer, inputImage.width, inputImage.height, downscaleFactor);
  saveImageBuffer(resizedBuffer, outputWidth, outputHeight, outputPath);
};

const getAverageHits = (buffer: Uint32Array, width: number, height: number) => {
  const sum = buffer.reduce((prev, cur) => prev + cur, 0);
  return Math.max(1, sum / (width * height));
};

export const plotAutomata = (
  path: string,
  width: number,
  height: number,
  automata: () => Float32Array,
): void => {
  const output = automata();
  saveImageBuffer(output, width, height, path);
};

export const plot1dCA = (
  path: string,
  width: number,
  height: number,
  nextCellState: Next1dCellStateFunction,
  colors: Color[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  startAtLine = 0,
  deadCellState?: Optional<number>,
  wrapPlotter?: Wrapper<PixelPlotter>,
): CellularAutomataGrid => {
  // we create a buffer and a standard plotter
  const buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  let plotter = makePlotter(buffer, width, height);
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  const grid = plot1dAutomaton(plotter, width, height, nextCellState, colors, deadCellState, iterations, initialState, startAtLine);

  // and finally save the image
  saveImageBuffer(buffer, width, height, path);

  return grid;
};

export const plot2dCA = (
  path: string,
  width: number,
  height: number,
  nextCellState: Next2dCellStateFunction,
  colors: Color[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  deadCellState?: Optional<number>,
  wrapPlotter?: Wrapper<PixelPlotter>,
): CellularAutomataGrid => {
  // we create a buffer and a standard plotter
  const buffer = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  let plotter = makePlotter(buffer, width, height);
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  const grid = plot2dAutomaton(plotter, width, height, nextCellState, colors, deadCellState, iterations, initialState);

  // and finally save the image
  saveImageBuffer(buffer, width, height, path);

  return grid;
};

export const plot2dHexCA = (
  path: string,
  width: number,
  height: number,
  nextCellState: Next2dCellStateFunction,
  colors: Color[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  hexagonalRadius = 10,
  hexagonBorder = 3,
  deadCellState?: Optional<number>,
  wrapPlotter?: Wrapper<PixelPlotter>,
): CellularAutomataGrid => {
  // we compute the size of the final buffer, according to ther hexagon size
  const hexagonalRadiusWithBorder = hexagonalRadius + hexagonBorder;

  const w = Math.sqrt(3) * hexagonalRadiusWithBorder;
  const h = 2 * hexagonalRadiusWithBorder;
  const skewness = (height * 0.5 * 0.5);

  const bufferWidth = Math.trunc(width * w);
  const bufferHeight = Math.trunc(height * h * 0.75);

  // we create a buffer for drawing
  const buffer = fillPicture(new Float32Array(bufferWidth * bufferHeight * 4), 0, 0, 0, 1);

  // the plotter is a regular buffer plotter, encapsulated by a plotter that draws hexagon
  const canvasPlotter = makePlotter(buffer, bufferWidth, bufferHeight);
  const hexagonPlotter = (x: number, y: number, color: Color) => {
    drawFilledNgon(6, x, y, hexagonalRadius + 1, color, canvasPlotter);
  };
  
  // the final plotter encapsulates the hexagon plotter with a logic for converting the hex grid coordinates to the buffer coordinates
  let plotter: PixelPlotter = (x, y, color) => {
    const fx = Math.trunc((x - skewness) * w + y * w * 0.5);
    const fy = Math.trunc(y * 0.75 * h);
    if (fx >= 0 && fx < bufferWidth && fy >= 0 && fy < bufferHeight) {
      hexagonPlotter(fx, fy, color);
      return true;
    }
    return false;
  };

  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  const grid = plot2dAutomaton(plotter, width, height, nextCellState, colors, deadCellState, iterations, initialState);

  // and finally save the image
  saveImageBuffer(buffer, bufferWidth, bufferHeight, path);

  return grid;
};

export const plotSymmetrical2dHexCA = (
  path: string,
  width: number,
  height: number,
  nextCellState: Next2dCellStateFunction,
  colors: Color[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  hexagonalRadius = 10,
  hexagonBorder = 3,
  deadCellState?: Optional<number>,
  wrapPlotter?: Wrapper<PixelPlotter>,
): CellularAutomataGrid => {
  // we compute the size of the final buffer, according to a fixed hexagon size
  const hexagonalRadiusWithBorder = hexagonalRadius + hexagonBorder;

  const w = Math.sqrt(3) * hexagonalRadiusWithBorder;
  const h = 2 * hexagonalRadiusWithBorder;
  const skewness = (height * 0.5 * 0.5);

  const bufferWidth = Math.trunc(width * w);
  const bufferHeight = Math.trunc(height * h * 0.75);

  // we create a buffer for drawing
  const buffer = fillPicture(new Float32Array(bufferWidth * bufferHeight * 4), 0, 0, 0, 1);

  // the plotter is a regular buffer plotter, encapsulated by a plotter that draws hexagon
  const canvasPlotter = makePlotter(buffer, bufferWidth, bufferHeight);
  const hexagonPlotter = (x: number, y: number, color: Color) => {
    drawFilledNgon(6, x, y, hexagonalRadius + 1, color, canvasPlotter);
  };

  // we create a plotter that wraps the hexagon plotter for adding D6-symmetry
  const d6Transforms = makeDihedralSymmetry(6);
  const d6SymmetryPlotter: PixelPlotter = (x, y, color) => {
    // we recenter the coordinates to 0, 0
    const x0 = x - bufferWidth / 2;
    const y0 = y - bufferHeight / 2;

    // we plot all the hexagon, with the symmetry transformations
    let drawn = false;
    if (x >= 0 && x < bufferWidth && y >= 0 && y < bufferHeight) {
      hexagonPlotter(Math.trunc(x), Math.trunc(y), color);
      drawn = true;
    }
    d6Transforms.forEach((f) => {
      const fz = f(complex(x0, y0));
      const fx = fz.re + bufferWidth / 2;
      const fy = fz.im + bufferHeight / 2;
      if (fx >= 0 && fx < bufferWidth && fy >= 0 && fy < bufferHeight) {
        hexagonPlotter(Math.trunc(fx), Math.trunc(fy), color);
        drawn = true;
      }
    });
    return drawn;
  };

  // the final plotter encapsulates the symmetrical plotter with a logic for converting the hex grid coordinates to the buffer coordinates
  let plotter: PixelPlotter = (x, y, color) => {
    const fx = Math.trunc((x - skewness) * w + y * w * 0.5);
    const fy = Math.trunc(y * 0.75 * h);
    return d6SymmetryPlotter(fx, fy, color);
  };

  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  const prunedNextCellState: Next2dCellStateFunction = (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
    // TODO maybe we can externalize this into lattice functions (including rhombic, etc.)
    const hx = (x - skewness) * w + y * w * 0.5;
    const hy = y * 0.75 * h;

    // we make sure to keep only 1/12th of the shape, given that a D6 symmetry will be applied
    const theta = Math.atan2(hy - bufferHeight / 2, hx - bufferWidth / 2);
    if (theta < 0 || theta > Math.PI / 6) {
      return 0;
    }

    return nextCellState(stateGrid, gridWidth, gridHeight, currentState, x, y);
  };

  const grid = plot2dAutomaton(plotter, width, height, prunedNextCellState, colors, deadCellState, iterations, initialState);

  // and finally save the image
  saveImageBuffer(buffer, bufferWidth, bufferHeight, path);

  return grid;
};

export const plot2dHexMultistateCASvg = async (
  path: string,
  width: number,
  height: number,
  svgWidth: number,
  svgHeight: number,
  nextCellState: Next2dCellStateFunction,
  colors: Color[],
  makeTiles: (scale: number, doc: SvgDocument) => PixelPlotter[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  hexagonalRadius = 12,
  hexagonBorder = 1,
  scale = 1,
  deadCellState?: Optional<number>,
): Promise<CellularAutomataGrid> => {
  // we compute the size of the final buffer, according to ther hexagon size
  const hexagonalRadiusWithBorder = (hexagonalRadius + hexagonBorder) * scale;

  const w = Math.sqrt(3) * hexagonalRadiusWithBorder;
  const h = 2 * hexagonalRadiusWithBorder;
  const skewness = (height * 0.5 * 0.5);

  const bufferWidth = Math.trunc(width * w);
  const bufferHeight = Math.trunc(height * h * 0.75);

  // the plotter is a SVG plotter
  const document = makeSvgDocument();
  document.viewbox(0, 0, bufferWidth, bufferHeight);
  document.attr({ width: svgWidth, height: svgHeight, style: 'background-color: #000' });
  
  const statePlotters = makeTiles(scale, document);

  // the final plotter introduce a logic for converting the hex grid coordinates to the buffer coordinates
  // it will also delegate the plotting to a subplotter corresponding to the cell state (each subplotter draws a different shape)
  const plotter: PixelPlotter = (x, y, color, cellState) => {
    const fx = Math.trunc((x - skewness) * w + y * w * 0.5);
    const fy = Math.trunc(y * 0.75 * h);
    if (fx >= 0 && fx < bufferWidth && fy >= 0 && fy < bufferHeight) {
      statePlotters[cellState](fx, fy, color);
      return true;
    }
    return false;
  };

  const grid = plot2dAutomaton(plotter, width, height, nextCellState, colors, deadCellState, iterations, initialState);

  // and save the image as svg
  saveSvgToFile(document, `${path}.svg`)

  // and finally convert the svg to a png
  await sharp(`${path}.svg`)
    .png()
    .flatten({ background: { r: 0, g: 0, b: 0 } })
    .toFile(path);

  return grid;
};

export const plot2dMultistateCASvg = async (
  path: string,
  width: number,
  height: number,
  svgWidth: number,
  svgHeight: number,
  nextCellState: Next2dCellStateFunction,
  colors: Color[],
  makeTiles: (scale: number, doc: SvgDocument) => PixelPlotter[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  tileSize = 10,
  tileBorder = 0,
  scale = 1,
  deadCellState?: Optional<number>,
): Promise<CellularAutomataGrid> => {
  // we compute the size of the final buffer, according to the tile size
  tileSize = (tileSize + tileBorder) * scale;
  const bufferWidth = Math.trunc(width * tileSize);
  const bufferHeight = Math.trunc(height * tileSize);

  // the plotter is a SVG plotter
  const document = makeSvgDocument();
  document.viewbox(0, 0, bufferWidth, bufferHeight);
  document.attr({ width: svgWidth, height: svgHeight, style: 'background-color: #000' });
  
  const statePlotters = makeTiles(scale, document);

  // the final plotter introduce a logic for converting the hex grid coordinates to the buffer coordinates
  // it will also delegate the plotting to a subplotter corresponding to the cell state (each subplotter draws a different shape)
  const plotter: PixelPlotter = (x, y, color, cellState) => {
    const fx = Math.trunc(x * tileSize);
    const fy = Math.trunc(y * tileSize);
    if (fx >= 0 && fx < bufferWidth && fy >= 0 && fy < bufferHeight) {
      statePlotters[cellState](fx, fy, color);
      return true;
    }
    return false;
  };

  const grid = plot2dAutomaton(plotter, width, height, nextCellState, colors, deadCellState, iterations, initialState);

  // and save the image as svg
  saveSvgToFile(document, `${path}.svg`)

  // and finally convert the svg to a png
  await sharp(`${path}.svg`)
    .png()
    .flatten({ background: { r: 0, g: 0, b: 0 } })
    .toFile(path);

  return grid;
};

export const plotDomainColoring2 = (
  path: string,
  bitmap: Float32Array,
  width: number,
  height: number,
  f: ComplexToComplexFunction,
  domain: PlotDomain = BI_UNIT_DOMAIN
): void => {
  const image = createImage(width, height, 0, 0, 0, 255);
  const buffer = image.buffer;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      // each pixel of the grid is mapped to the domain...
      const [ x, y ] = mapPixelToDomain(i, j, width, height, domain);

      // ... the transformation is then applied...
      const z = complex(x, y);
      const fz = f(z);

      // ... then the transformed 2d value is re-mapped to the pixel domain
      const [ fx, fy ] = mapDomainToPixel(fz.re, fz.im, domain, width, height);

      // transformed pixels that are outside the image are discarded
      if (fx < 0 || fy < 0 || fx >= width || fy >= height) {
        continue;
      }

      // color of pixel <i,j> = color of transformed pixel <fx, fy>
      const colorIdx = (fx + fy * width) * 4;

      // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
      const idx = (i + j * width) * 4;
      buffer[idx + 0] = bitmap[colorIdx + 0];
      buffer[idx + 1] = bitmap[colorIdx + 1];
      buffer[idx + 2] = bitmap[colorIdx + 2];
      buffer[idx + 3] = 255;
    }
  }

  saveImage(image, path);
};

export const plotDomainColoring = (
  path: string,
  bitmapPath: string,
  f: ComplexToComplexFunction,
  domain: PlotDomain = BI_UNIT_DOMAIN
): void => {
  const picture = readImage(bitmapPath);
  const width = picture.width;
  const height = picture.height;
  const bitmap = picture.buffer;
  plotDomainColoring2(path, bitmap, width, height, f, domain);
};

export const plotDomainReverseColoring = (
  path: string,
  bitmapPath: string,
  f: ComplexToComplexFunction,
  domain: PlotDomain = BI_UNIT_DOMAIN,
  stripe = true,
): void => {
  const picture = readImage(bitmapPath);
  const width = picture.width;
  const height = picture.height;
  const bitmap = picture.buffer;

  const newBitmap = makeInvertCollageHorizontal(bitmap, width, height, stripe);
  plotDomainColoring2(path, newBitmap, width, height, f, domain);
};

export const plotDomainReverseColoring2 = (
  path: string,
  bitmap: Float32Array,
  width: number,
  height: number,
  f: ComplexToComplexFunction,
  domain: PlotDomain = BI_UNIT_DOMAIN
): void => {
  const newBitmap = makeInvertCollageHorizontal(bitmap, width, height);
  plotDomainColoring2(path, newBitmap, width, height, f, domain);
};

const makeHitmapZPlotter = (buffer: Float32Array, hitmap: Uint32Array, width: number, height: number, domain: PlotDomain): ComplexPlotter => {
  return (z, color) => {
    const fz = mapComplexDomainToPixel(z, domain, width, height);
    let x = fz.re;
    let y = fz.im;
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return false;
    }
    x = Math.trunc(x);
    y = Math.trunc(y);

    const idx1 = (x + y * width);
    hitmap[idx1] += 1;

    const idx2 = idx1 * 4;
    buffer[idx2 + 0] = color[0];
    buffer[idx2 + 1] = color[1];
    buffer[idx2 + 2] = color[2];
    buffer[idx2 + 3] = color[3];
    return true;
  };
};

const makeAdditiveHitmapZPlotter = (buffer: Float32Array, hitmap: Uint32Array, width: number, height: number, domain: PlotDomain): ComplexPlotter => {
  return (z, color) => {
    const fz = mapComplexDomainToPixel(z, domain, width, height);
    let x = fz.re;
    let y = fz.im;
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return false;
    }
    x = Math.trunc(x);
    y = Math.trunc(y);

    const idx1 = (x + y * width);
    hitmap[idx1] += 1;

    const idx2 = idx1 * 4;
    buffer[idx2 + 0] += color[0];
    buffer[idx2 + 1] += color[1];
    buffer[idx2 + 2] += color[2];
    buffer[idx2 + 3] = color[3];
    return true;
  };
};
