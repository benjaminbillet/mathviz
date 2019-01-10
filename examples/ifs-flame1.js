import { pickRandom, randomIntegerNormal, randomComplex } from '../utils/random';
import { makeSinusoidal, makeLinear } from '../transform';
import { generateTransformationSet, plotFlame } from '../ifs/fractal-flame';
import { expandPalette, getBigQualitativePalette } from '../utils/palette';
import { applyContrastBasedScalefactor, convertUnitToRGBA } from '../utils/color';
import { saveImageBuffer } from '../utils/picture';
import { addFileLogger } from '../utils/log';

// we will get only one transformation used in this example
const NON_LINEAR_TRANSFORMATIONS = [
  makeSinusoidal,
];

const buildAndPlotFlame = async (path, width, height, nbPoints, nbIterations) => {
  // we will save all transformation parameters into this file
  const configFile = `${path}.txt`;
  addFileLogger(configFile);

  // we generate a set of transformations that will be picked according to a normal law
  const transforms = generateTransformationSet(20, NON_LINEAR_TRANSFORMATIONS, [ makeLinear ]);
  const randomInt = randomIntegerNormal(0, transforms.length, 1, 0.15);

  // we create a palette of 5 colors, and duplicate them to match the number of transform
  // we also make sure that the colors have 0-1 components
  let colors = expandPalette(getBigQualitativePalette(5), transforms.length);
  colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);

  // we pick and apply a random final transform
  const finalTransform = pickRandom(NON_LINEAR_TRANSFORMATIONS)();

  // initial points will be picked randomly
  const initialPointPicker = randomComplex;

  // we create a buffer and run the standard plotter
  let buffer = new Float32Array(width * height * 4);
  plotFlame(buffer, width, height, transforms, randomInt, colors, initialPointPicker, finalTransform, nbPoints, nbIterations);

  // we correct the generated image using the contrast-based scalefactor technique
  const averageHits = Math.max(1, (nbPoints * nbIterations) / (width * height));
  applyContrastBasedScalefactor(buffer, width, height, averageHits);

  // we make sure that the colors are proper RGB
  buffer = convertUnitToRGBA(buffer, width, height);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

// the number of points and iterations is high, it can take more than 30-40 minutes to get a picture
buildAndPlotFlame(`flame-${new Date().getTime()}.png`, 2048, 2048, 1000, 10000);
