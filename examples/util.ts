import * as D3Color from 'd3-color';
import { simpleWalkChaosPlot } from '../ifs/chaos-game';
import { plotFlame, plotFlameWithColorStealing, makeMixedColorSteal, iterateFlamePoint } from '../ifs/fractal-flame';
import { makeIdentityFunction } from '../transform';
import { applyContrastBasedScalefactor, applyLinearScalefactor, convertUnitToRGBA, mixColorLinear } from '../utils/color';
import { complex } from '../utils/complex';
import { BI_UNIT_DOMAIN, scaleDomain } from '../utils/domain';
import { performClahe } from '../utils/histogram';
import { forEachPixel, mapPixelToDomain, saveImageBuffer, readImage, normalizeBuffer, saveImage, mapDomainToPixel, createImage } from '../utils/picture';
import { withinPolygon } from '../utils/polygon';
import { randomComplex, randomIntegerWeighted } from '../utils/random';
import { expandPalette, getBigQualitativePalette, MAVERICK } from '../utils/palette';
import { estimateAttractorDomain } from '../attractors/plot';
import { downscale, downscale2 } from '../utils/downscale';
import { makeAdditiveBufferPlotter, makeBufferPlotter, makeUnmappedBufferPlotter, makePixelToComplexPlotter } from '../utils/plotter';
import { plotVectorField, DefaultGridShuffle } from '../misc/vector-field';
import { plot2dAutomaton } from '../automata/cellular/2d-automaton';
import { drawFilledNgon } from '../utils/raster';
import { makeDihedralSymmetry } from '../utils/symmetry';
import { Attractor, CellularAutomataGrid, Color, ColorMapFunction, ColorSteal, ComplexPlotter, ComplexToColorFunction, ComplexToComplexFunction, Ifs, IterableComplexFunction, IterableRealFunction, NextCellStateFunction, NoiseFunction2D, Optional, PixelPlotter, PlotBuffer, PlotDomain, Polygon, Transform2D, VectorFieldFunction, VectorFieldTimeFunction, Wrapper } from '../utils/types';
import { makeInvertCollageHorizontal } from '../symmetry/color-reversing-wallpaper-group';
import { blendAverage, blendDarken, blendLighten } from '../utils/blend';

export const plotFunctionBuffer = (width: number, height: number, f: ComplexToColorFunction, domain = BI_UNIT_DOMAIN, colorfunc?: ColorMapFunction, normalize = true): PlotBuffer => {
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
      } else {
        buffer[idx + 0] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
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
    });
  }

  return buffer;
};

export const plotFunction = async (path: string, width: number, height: number, f: ComplexToColorFunction, domain = BI_UNIT_DOMAIN, colorfunc?: ColorMapFunction, normalize = true) => {
  let buffer = plotFunctionBuffer(width, height, f, domain, colorfunc, normalize);
  buffer = convertUnitToRGBA(buffer);
  await saveImageBuffer(buffer, width, height, path);
};

export const plotFunctionClahe = async (path: string, width: number, height: number, f: ComplexToColorFunction, domain = BI_UNIT_DOMAIN, colorfunc: ColorMapFunction, normalize = true) => {
  const buffer = plotFunctionBuffer(width, height, f, domain, colorfunc, normalize);

  // convert into a single channel grayscale picture
  const newBuffer = new Uint8Array(width * height);
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => newBuffer[idx / 4] = r * 255);

  performClahe(newBuffer, width, height, newBuffer, 16, 16, 256, 128);

  // convert back into a colorized rgba image
  await saveImageBuffer(newBuffer.reduce((result, val, i) => {
    const color = colorfunc(val / 255);
    result[i * 4 + 0] = color[0] * 255;
    result[i * 4 + 1] = color[1] * 255;
    result[i * 4 + 2] = color[2] * 255;
    result[i * 4 + 3] = 255;
    return result;
  }, new Uint8Array(width * height * 4)), width, height, path);
};

export const plotWalk = async (path: string, width: number, height: number, walk: IterableComplexFunction, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  let buffer: PlotBuffer = new Float32Array(width * height * 4);

  simpleWalkChaosPlot(buffer, width, height, walk, null, domain, nbIterations);

  buffer = applyLinearScalefactor(buffer, width, height);
  buffer = convertUnitToRGBA(buffer);

  await saveImageBuffer(buffer, width, height, path);
};

export const plotWalkClahe = async (path: string, width: number, height: number, walk: IterableComplexFunction, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  let buffer: PlotBuffer = new Float32Array(width * height * 4);

  simpleWalkChaosPlot(buffer, width, height, walk, null, domain, nbIterations);

  buffer = applyLinearScalefactor(buffer, width, height);

  // convert into a single channel grayscale picture
  const newBuffer = new Uint8Array(width * height);
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => newBuffer[idx / 4] = r * 255);

  performClahe(newBuffer, width, height, newBuffer, 16, 16, 256, 4);

  // convert back into a rgba image
  await saveImageBuffer(newBuffer.reduce((result, val, i) => {
    result[i * 4 + 0] = val;
    result[i * 4 + 1] = val;
    result[i * 4 + 2] = val;
    result[i * 4 + 3] = 255;
    return result;
  }, new Uint8Array(width * height * 4)), width, height, path);
};

export const plotPolygon = async (path: string, width: number, height: number, polygon: Polygon, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  let buffer: PlotBuffer = new Float32Array(width * height * 4);

  const walk = () => {
    let zn = randomComplex();
    while (withinPolygon(zn, polygon) === false) {
      zn = randomComplex();
    }
    return zn;
  };

  simpleWalkChaosPlot(buffer, width, height, walk, null, domain, nbIterations);

  buffer = convertUnitToRGBA(buffer);
  await saveImageBuffer(buffer, width, height, path);
};

export const plotIfsFlame = async (
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
) => {
  // we create a buffer and a standard plotter
  let buffer: PlotBuffer = new Float32Array(width * height * 4);
  let plotter = makeAdditiveBufferPlotter(buffer, width, height, domain);
  if (additiveColors === false) {
    plotter = makeBufferPlotter(buffer, width, height, domain);
  }
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  plotFlame(transforms, randomInt, colors, plotter, initialPointPicker, finalTransform, nbPoints, nbIterations, resetIfOverflow, colorMerge);

  // we correct the generated image using the contrast-based scalefactor technique
  let averageHits = 1;
  if (additiveColors) {
    // averageHits = Math.max(1, (nbPoints * nbIterations) / (width * height));
    averageHits = getAverageHits(buffer, width, height);
  }

  buffer = applyContrastBasedScalefactor(buffer, width, height, averageHits);
  // buffer = applyLinearScalefactor(buffer, width, height);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const plotIfs = async (
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
) => {
  const transforms = ifs.functions;
  const randomInt = randomIntegerWeighted(ifs.probabilities);

  if (colors == null) {
    colors = expandPalette(getBigQualitativePalette(5), transforms.length);
    colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);
  }

  // we create a buffer and a standard plotter
  let buffer: PlotBuffer = new Float32Array(width * height * 4);
  let plotter = makeAdditiveBufferPlotter(buffer, width, height, domain);
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  plotFlame(transforms, randomInt, colors, plotter, initialPointPicker, finalTransform, nbPoints, nbIterations);

  // we correct the generated image using the contrast-based scalefactor technique
  // const averageHits =  Math.max(1, (nbPoints * nbIterations) / (width * height));
  const averageHits = getAverageHits(buffer, width, height);
  buffer = applyContrastBasedScalefactor(buffer, width, height, averageHits);
  // buffer = applyLinearScalefactor(buffer, width, height);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const plotIfsGrid = async (
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
) => {
  const transforms = ifs.functions;
  const randomInt = randomIntegerWeighted(ifs.probabilities);

  if (colors == null) {
    colors = expandPalette(getBigQualitativePalette(5), transforms.length);
    colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);
  }

  // we create a buffer and a standard plotter
  let buffer: PlotBuffer = new Float32Array(width * height * 4);
  let plotter = makeAdditiveBufferPlotter(buffer, width, height, domain);
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
  // const averageHits =  Math.max(1, (nbPoints * nbIterations) / (width * height));
  const averageHits = getAverageHits(buffer, width, height);
  buffer = applyContrastBasedScalefactor(buffer, width, height, averageHits);
  // buffer = applyLinearScalefactor(buffer, width, height);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const plotNoise = async (noiseFunction: () => PlotBuffer, size: number, outputPath: string) => {
  const noise = noiseFunction();
  const output = convertUnitToRGBA(noise);
  await saveImageBuffer(output, size, size, outputPath);
};

export const plotNoiseFunction = async (noiseFunction: NoiseFunction2D, size: number, outputPath: string, normalize = true) => {
  const buffer = new Float32Array(size * size * 4);
  forEachPixel(buffer, size, size, (r, g, b, a, i, j, idx) => {
    const intensity = noiseFunction(i / size, j / size);
    buffer[idx + 0] = intensity;
    buffer[idx + 1] = intensity;
    buffer[idx + 2] = intensity;
  });
  /*if (normalize) {
    normalizeBuffer(buffer, size, size);
  }
  await saveImageBuffer(convertUnitToRGBA(buffer), size, size, outputPath);
  return buffer;*/
};

export const plotAttractor = async (
  path: string,
  width: number,
  height: number,
  attractor: Attractor,
  initialPointPicker = () => complex(0, 0),
  colorFunc: ColorSteal = () => [ 1, 1, 1 ],
  nbIterations = 1000000,
  domain = BI_UNIT_DOMAIN,
  wrapPlotter?: Wrapper<ComplexPlotter>,
) => {
  await plotAttractorMultipoint(path, width, height, attractor, initialPointPicker, colorFunc, 1, nbIterations, domain, wrapPlotter);
};

export const plotAttractorMultipoint = async (
  path: string,
  width: number,
  height: number,
  attractor: Attractor,
  initialPointPicker = () => complex(0, 0),
  colorFunc: ColorSteal = () => [ 1, 1, 1 ],
  nbPoints = 10,
  nbIterations = 1000000,
  domain = BI_UNIT_DOMAIN,
  wrapPlotter?: Wrapper<ComplexPlotter>,
) => {
  // we create a buffer and the standard plotter
  let buffer: PlotBuffer = new Float32Array(width * height * 4);
  let plotter = makeAdditiveBufferPlotter(buffer, width, height, domain);
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  plotFlameWithColorStealing([ attractor ], () => 0, colorFunc, plotter, false, initialPointPicker, makeIdentityFunction(), nbPoints, nbIterations);

  // we correct the generated image using the contrast-based scalefactor technique
  // const averageHits = Math.max(1, nbIterations / (width * height));
  const averageHits = getAverageHits(buffer, width, height);
  buffer = applyContrastBasedScalefactor(buffer, width, height, averageHits);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const plotAutoscaledAttractor = async (
  path: string,
  width: number,
  height: number,
  attractor: Attractor,
  initialPointPicker = () => complex(0, 0),
  palette = MAVERICK,
  nbIterations = 1000000,
  autoScaleIterations = 100000,
  zoomAfterAutoscale = 1.2,
) => {
  // we compute automatically the domain of the attractor
  const domain = scaleDomain(estimateAttractorDomain(attractor, initialPointPicker, makeIdentityFunction(), autoScaleIterations), zoomAfterAutoscale);
  console.log('Estimated domain', domain);

  // we create a color function that will apply the palette depending on the location of the point and the number of iterations
  const colorFunc = makeMixedColorSteal(palette, domain.xmax / 2, nbIterations, 0.5, 0.5);

  // and we plot
  plotAttractor(path, width, height, attractor, initialPointPicker, colorFunc, nbIterations, domain);
};

export const plotSupersampledVectorField = async (
  path: string,
  width: number,
  height: number,
  vectorFunction: VectorFieldFunction,
  colorFunc: ColorSteal,
  timeFunction: VectorFieldTimeFunction = () => 0,
  nbIterations = 500,
  finalTransform = makeIdentityFunction(),
  wrapPlotter?: Wrapper<ComplexPlotter>,
  supersampling = 4,
) => {
  // supersampling consists into rendering a bigger image and downscale it afterwards
  const superWidth = supersampling * width;
  const superHeight = supersampling * height;

  // we create a buffer and the standard plotter
  let buffer: PlotBuffer = new Float32Array(superWidth * superHeight * 4);
  let plotter = makeBufferPlotter(buffer, superWidth, superHeight, scaleDomain(BI_UNIT_DOMAIN, 2));
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  plotVectorField(vectorFunction, colorFunc, plotter, timeFunction, finalTransform, 0.025, BI_UNIT_DOMAIN, DefaultGridShuffle, 0.01, nbIterations);

  // downscale from the super size to the requested size
  buffer = downscale2(buffer, superWidth, superHeight, width, height);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const downsampleImage = async (inputPath: string, outputPath: string, factor = 1) => {
  const inputImage = await readImage(inputPath, 255);

  const downscaleFactor = 1 / factor;
  const outputWidth = Math.trunc(downscaleFactor * inputImage.width);
  const outputHeight = Math.trunc(downscaleFactor * inputImage.height);

  const resizedBuffer = downscale(inputImage.buffer, inputImage.width, inputImage.height, downscaleFactor);
  await saveImageBuffer(convertUnitToRGBA(resizedBuffer), outputWidth, outputHeight, outputPath);
};

const getAverageHits = (buffer: PlotBuffer, width: number, height: number) => {
  const sum = buffer.reduce((prev, cur, i) => {
    if ((i + 1) % 4 === 0) {
      return prev + cur;
    }
    return prev;
  }, 0);
  return Math.max(1, sum / (width * height));
};


export const plotAutomata = async (
  path: string,
  width: number,
  height: number,
  automata: () => Promise<PlotBuffer>,
) => {
  const output = await automata();
  await saveImageBuffer(convertUnitToRGBA(output), width, height, path);
};

export const plot2dCA = async (
  path: string,
  width: number,
  height: number,
  nextCellState: NextCellStateFunction,
  colors: Color[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  deadCellState?: Optional<number>,
  wrapPlotter?: Wrapper<ComplexPlotter>,
) => {
  // we create a buffer and a standard plotter
  let buffer: PlotBuffer = new Float32Array(width * height * 4);
  let plotter = makeUnmappedBufferPlotter(buffer, width, height);
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  const grid = plot2dAutomaton(plotter, width, height, nextCellState, colors, deadCellState, iterations, initialState);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);

  return grid;
};

export const plot2dHexCA = async (
  path: string,
  width: number,
  height: number,
  nextCellState: NextCellStateFunction,
  colors: Color[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  hexagonalRadius = 10,
  hexagonBorder = 3,
  deadCellState?: Optional<number>,
  wrapPlotter?: Wrapper<ComplexPlotter>,
) => {
  // we compute the size of the final buffer, according to ther hexagon size
  const hexagonalRadiusWithBorder = hexagonalRadius + hexagonBorder;

  const w = Math.sqrt(3) * hexagonalRadiusWithBorder;
  const h = 2 * hexagonalRadiusWithBorder;

  const bufferWidth = Math.trunc(width * w);
  const bufferHeight = Math.trunc(height * h * 0.75);

  // we create a buffer for drawing
  let buffer: PlotBuffer = new Float32Array(bufferWidth * bufferHeight * 4);

  // the plotter is a regular buffer plotter, encapsulated by a plotter that draws hexagon
  const canvasPlotter = makePixelToComplexPlotter(makeUnmappedBufferPlotter(buffer, bufferWidth, bufferHeight));
  const hexagonPlotter: PixelPlotter = (x, y, color) => {
    drawFilledNgon(6, x, y, hexagonalRadius + 1, color, canvasPlotter);
  };

  // the final plotter encapsulates the hexagon plotter
  // with a logic for converting the hex grid coordinates to the buffer coordinates
  const skewness = (height * 0.5 * 0.5);
  let plotter: ComplexPlotter = (z, color) => {
    const x = Math.trunc((z.re - skewness) * w + z.im * w * 0.5);
    const y = Math.trunc(z.im * 0.75 * h);
    if (x >= 0 && x < bufferWidth && y >= 0 && y < bufferHeight) {
      hexagonPlotter(x, y, color);
    }
  };

  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  const grid = plot2dAutomaton(plotter, width, height, nextCellState, colors, deadCellState, iterations, initialState);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer);

  // and finally save the image
  await saveImageBuffer(buffer, bufferWidth, bufferHeight, path);

  return grid;
};

export const plotSymmetrical2dHexCA = async (
  path: string,
  width: number,
  height: number,
  nextCellState: NextCellStateFunction,
  colors: Color[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  hexagonalRadius = 10,
  hexagonBorder = 3,
  deadCellState?: Optional<number>,
  wrapPlotter?: Wrapper<ComplexPlotter>,
) => {
  // we compute the size of the final buffer, according to a fixed hexagon size
  const hexagonalRadiusWithBorder = hexagonalRadius + hexagonBorder;

  const w = Math.sqrt(3) * hexagonalRadiusWithBorder;
  const h = 2 * hexagonalRadiusWithBorder;

  const bufferWidth = Math.trunc(width * w);
  const bufferHeight = Math.trunc(height * h * 0.75);

  // we create a buffer for drawing
  let buffer: PlotBuffer = new Float32Array(bufferWidth * bufferHeight * 4);

  // the plotter is a regular buffer plotter, encapsulated by a plotter that draws hexagon
  const canvasPlotter = makePixelToComplexPlotter(makeUnmappedBufferPlotter(buffer, bufferWidth, bufferHeight));
  const hexagonPlotter: PixelPlotter = (x, y, color) => {
    drawFilledNgon(6, x, y, hexagonalRadius + 1, color, canvasPlotter);
  };

  // we create a plotter that wrap the previous one for adding D6-symmetry
  const d6Transforms = makeDihedralSymmetry(6);
  const d6SymmetryPlotter: PixelPlotter = (x, y, color) => {
    // we recenter the coordinates to 0, 0
    const x0 = x - bufferWidth / 2;
    const y0 = y - bufferHeight / 2;

    // we plot all the hexagon, with the symmetry transformations
    if (x >= 0 && x < bufferWidth && y >= 0 && y < bufferHeight) {
      hexagonPlotter(Math.trunc(x), Math.trunc(y), color);
    }
    d6Transforms.forEach((f) => {
      const fz = f(complex(x0, y0));
      const fx = fz.re + bufferWidth / 2;
      const fy = fz.im + bufferHeight / 2;
      if (fx >= 0 && fx < bufferWidth && fy >= 0 && fy < bufferHeight) {
        hexagonPlotter(Math.trunc(fx), Math.trunc(fy), color);
      }
    });
  };

  // the final plotter encapsulates the symmetrical plotter
  // with a logic for converting the hex grid coordinates to the buffer coordinates
  const skewness = (height * 0.5 * 0.5);
  let plotter: ComplexPlotter = (z, color) => {
    const x = (z.re - skewness) * w + z.im * w * 0.5;
    const y = z.im * 0.75 * h;
    d6SymmetryPlotter(x, y, color);
  };

  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  const prunedNextCellState: NextCellStateFunction = (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
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

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer);

  // and finally save the image
  await saveImageBuffer(buffer, bufferWidth, bufferHeight, path);

  return grid;
};

export const plotDomainColoring2 = async (
  path: string,
  bitmap: PlotBuffer,
  width: number,
  height: number,
  f: ComplexToComplexFunction,
  domain: PlotDomain = BI_UNIT_DOMAIN
) => {
  const image = createImage(width, height, 0, 0, 0, 255);
  const buffer = image.getImage().data;

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

  await saveImage(image, path);
};

export const plotDomainColoring = async (
  path: string,
  bitmapPath: string,
  f: ComplexToComplexFunction,
  domain: PlotDomain = BI_UNIT_DOMAIN
) => {
  const picture = await readImage(bitmapPath);
  const width = picture.width;
  const height = picture.height;
  const bitmap = picture.buffer;

  await plotDomainColoring2(path, bitmap, width, height, f, domain);
};

export const plotDomainReverseColoring = async (
  path: string,
  bitmapPath: string,
  f: ComplexToComplexFunction,
  domain: PlotDomain = BI_UNIT_DOMAIN,
  stripe = true,
) => {
  const picture = await readImage(bitmapPath, 255);
  const width = picture.width;
  const height = picture.height;
  const bitmap = picture.buffer;

  const newBitmap = makeInvertCollageHorizontal(bitmap, width, height, stripe);
  await plotDomainColoring2(path, convertUnitToRGBA(newBitmap), width, height, f, domain);
};

export const plotDomainReverseColoring2 = async (
  path: string,
  bitmap: PlotBuffer,
  width: number,
  height: number,
  f: ComplexToComplexFunction,
  domain: PlotDomain = BI_UNIT_DOMAIN
) => {
  const newBitmap = makeInvertCollageHorizontal(bitmap.map(x => x / 255), width, height);
  await plotDomainColoring2(path, convertUnitToRGBA(newBitmap), width, height, f, domain);
};