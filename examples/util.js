import { simpleWalkChaosPlot } from '../ifs/chaos-game';
import { plotFlame, plotFlameWithColorStealing, makeMixedColorSteal, iterateFlamePoint } from '../ifs/fractal-flame';
import { makeIdentityFunction } from '../transform';
import { applyContrastBasedScalefactor, applyLinearScalefactor, convertUnitToRGBA, mixColorLinear } from '../utils/color';
import { complex } from '../utils/complex';
import { BI_UNIT_DOMAIN, scaleDomain } from '../utils/domain';
import { performClahe } from '../utils/histogram';
import { forEachPixel, mapPixelToDomain, saveImageBuffer, readImage, normalizeBuffer } from '../utils/picture';
import { withinPolygon } from '../utils/polygon';
import { randomComplex, randomIntegerWeighted } from '../utils/random';
import { expandPalette, getBigQualitativePalette, MAVERICK } from '../utils/palette';
import { estimateAttractorDomain } from '../attractors/plot';
import { downscale, downscale2 } from '../utils/downscale';
import { makeAdditiveBufferPlotter, makeBufferPlotter, makeUnmappedBufferPlotter } from '../utils/plotter';
import { plotVectorField, DefaultGridShuffle } from '../misc/vector-field';
import { plotCyclicCellularAutomaton, plotCyclicCellularAutomaton2 } from '../automata/cellular/cyclic-ca';


export const plotFunctionBuffer = (width, height, f, domain = BI_UNIT_DOMAIN, colorfunc = null, normalize = true) => {
  const buffer = new Float32Array(width * height * 4);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const [ x, y ] = mapPixelToDomain(i, j, width, height, domain);

      const idx = (i + j * width) * 4;
      const color = f(complex(x, y));
      if (color.length == null) {
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

export const plotFunction = async (path, width, height, f, domain = BI_UNIT_DOMAIN, colorfunc = null, normalize = true) => {
  let buffer = plotFunctionBuffer(width, height, f, domain, colorfunc, normalize);
  buffer = convertUnitToRGBA(buffer);
  await saveImageBuffer(buffer, width, height, path);
};

export const plotFunctionClahe = async (path, width, height, f, domain = BI_UNIT_DOMAIN, colorfunc = null, normalize = true) => {
  const buffer = plotFunctionBuffer(width, height, f, domain, normalize);

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

export const plotWalk = async (path, width, height, walk, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  let buffer = new Float32Array(width * height * 4);

  simpleWalkChaosPlot(buffer, width, height, walk, null, domain, nbIterations);

  buffer = applyLinearScalefactor(buffer, width, height);
  buffer = convertUnitToRGBA(buffer);

  await saveImageBuffer(buffer, width, height, path);
};

export const plotWalkClahe = async (path, width, height, walk, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  let buffer = new Float32Array(width * height * 4);

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

export const plotPolygon = async (path, width, height, polygon, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  let buffer = new Float32Array(width * height * 4);

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
  path,
  width,
  height,
  transforms,
  randomInt,
  colors,
  initialPointPicker = randomComplex,
  finalTransform = makeIdentityFunction(),
  nbPoints = 1000,
  nbIterations = 10000,
  domain = BI_UNIT_DOMAIN,
  resetIfOverflow = false,
  colorMerge = mixColorLinear,
  additiveColors = true,
  wrapPlotter = null,
) => {
  // we create a buffer and a standard plotter
  let buffer = new Float32Array(width * height * 4);
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
  buffer = convertUnitToRGBA(buffer, width, height);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const plotIfs = async (
  path,
  width,
  height,
  ifs,
  nbPoints = 1000,
  nbIterations = 10000,
  finalTransform = makeIdentityFunction(),
  domain = BI_UNIT_DOMAIN,
  initialPointPicker = randomComplex,
  colors = null,
  wrapPlotter = null,
) => {
  const transforms = ifs.functions;
  const randomInt = randomIntegerWeighted(ifs.probabilities);

  if (colors == null) {
    colors = expandPalette(getBigQualitativePalette(5), transforms.length);
    colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);
  }

  // we create a buffer and a standard plotter
  let buffer = new Float32Array(width * height * 4);
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
  buffer = convertUnitToRGBA(buffer, width, height);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const plotIfsGrid = async (
  path,
  width,
  height,
  ifs,
  nbIterations = 10000,
  finalTransform = makeIdentityFunction(),
  domain = BI_UNIT_DOMAIN,
  mappedDomain = BI_UNIT_DOMAIN,
  accuracy = 1,
  colors = null,
  wrapPlotter = null,
) => {
  const transforms = ifs.functions;
  const randomInt = randomIntegerWeighted(ifs.probabilities);

  if (colors == null) {
    colors = expandPalette(getBigQualitativePalette(5), transforms.length);
    colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);
  }

  // we create a buffer and a standard plotter
  let buffer = new Float32Array(width * height * 4);
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
  buffer = convertUnitToRGBA(buffer, width, height);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const plotNoise = async (noiseFunction, size, outputPath) => {
  const noise = noiseFunction();
  const output = convertUnitToRGBA(noise);
  await saveImageBuffer(output, size, size, outputPath);
};

export const plotNoiseFunction = async (noiseFunction, size, outputPath, normalize = true) => {
  const buffer = new Float32Array(size * size * 4);
  forEachPixel(buffer, size, size, (r, g, b, a, i, j, idx) => {
    const intensity = noiseFunction(i / size, j / size);
    buffer[idx + 0] = intensity;
    buffer[idx + 1] = intensity;
    buffer[idx + 2] = intensity;
  });
  if (normalize) {
    normalizeBuffer(buffer, size, size);
  }
  await saveImageBuffer(convertUnitToRGBA(buffer), size, size, outputPath);
  return buffer;
};

export const plotAttractor = async (
  path,
  width,
  height,
  attractor,
  initialPointPicker = () => complex(0, 0),
  colorFunc = () => [ 1, 1, 1 ],
  nbIterations = 1000000,
  domain = BI_UNIT_DOMAIN,
  wrapPlotter = null,
) => {
  await plotAttractorMultipoint(path, width, height, attractor, initialPointPicker, colorFunc, 1, nbIterations, domain, wrapPlotter);
};

export const plotAttractorMultipoint = async (
  path,
  width,
  height,
  attractor,
  initialPointPicker = () => complex(0, 0),
  colorFunc = () => [ 1, 1, 1 ],
  nbPoints = 10,
  nbIterations = 1000000,
  domain = BI_UNIT_DOMAIN,
  wrapPlotter = null,
) => {
  // we create a buffer and the standard plotter
  let buffer = new Float32Array(width * height * 4);
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
  buffer = convertUnitToRGBA(buffer, width, height);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const plotAutoscaledAttractor = async (
  path,
  width,
  height,
  attractor,
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
  path,
  width,
  height,
  vectorFunction,
  colorFunc,
  timeFunction = () => 0,
  nbIterations = 500,
  finalTransform = makeIdentityFunction(),
  wrapPlotter = null,
  supersampling = 4,
) => {
  // supersampling consists into rendering a bigger image and downscale it afterwards
  const superWidth = supersampling * width;
  const superHeight = supersampling * height;

  // we create a buffer and the standard plotter
  let buffer = new Float32Array(superWidth * superHeight * 4);
  let plotter = makeBufferPlotter(buffer, superWidth, superHeight, scaleDomain(BI_UNIT_DOMAIN, 2));
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  plotVectorField(vectorFunction, colorFunc, plotter, timeFunction, finalTransform, 0.025, BI_UNIT_DOMAIN, DefaultGridShuffle, 0.01, nbIterations);

  // downscale from the super size to the requested size
  buffer = downscale2(buffer, superWidth, superHeight, width, height);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer, width, height);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

export const downsampleImage = async (inputPath, outputPath, factor = 1) => {
  const inputImage = await readImage(inputPath, 255);

  const downscaleFactor = 1 / factor;
  const outputWidth = Math.trunc(downscaleFactor * inputImage.width);
  const outputHeight = Math.trunc(downscaleFactor * inputImage.height);

  const resizedBuffer = downscale(inputImage.buffer, inputImage.width, inputImage.height, downscaleFactor);
  await saveImageBuffer(convertUnitToRGBA(resizedBuffer), outputWidth, outputHeight, outputPath);
};

const getAverageHits = (buffer, width, height) => {
  const sum = buffer.reduce((prev, cur, i) => {
    if ((i + 1) % 4 === 0) {
      return prev + cur;
    }
    return prev;
  }, 0);
  return Math.max(1, sum / (width * height));
};


export const plotAutomata = async (
  path,
  width,
  height,
  automata,
) => {
  const output = await automata();
  await saveImageBuffer(convertUnitToRGBA(output), width, height, path);
};

export const plotCyclicCA = async (
  path,
  width,
  height,
  colors,
  range,
  threshold,
  maxState,
  neighborReduceFunc,
  iterations = 100,
  initialState = null,
  wrapPlotter = null,
) => {
  // we create a buffer and a standard plotter
  let buffer = new Float32Array(width * height * 4);
  let plotter = makeUnmappedBufferPlotter(buffer, width, height);
  if (wrapPlotter != null) {
    plotter = wrapPlotter(plotter);
  }

  const grid = plotCyclicCellularAutomaton(plotter, width, height, colors, range, threshold, maxState, neighborReduceFunc, iterations, initialState);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer, width, height);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);

  return grid;
};
