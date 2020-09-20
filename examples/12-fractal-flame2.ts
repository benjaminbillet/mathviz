import { generateTransformationSet } from '../ifs/fractal-flame';
import { makeLinear, makeScaleFunction, makeSimpleLinear, makeMobius } from '../transform';
import { mkdirs } from '../utils/fs';
import { expandPalette, getBigQualitativePalette } from '../utils/palette';
import { randomComplex, randomIntegerNormal, setRandomSeed } from '../utils/random';
import { plotIfsFlame } from './util';

const OUTPUT_DIRECTORY = `${__dirname}/../output/fractal-flame`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotFlame = async (path: string, width: number, height: number, seed: number, nbTransformations: number, nbPoints: number, nbIterations: number) => {
  // configure the PRNG
  setRandomSeed(seed);

  // we generate a set of transformations that will be picked according to a normal law
  const transforms = generateTransformationSet(nbTransformations, [ makeMobius, makeSimpleLinear ], [ makeLinear ]);
  const randomInt = randomIntegerNormal(0, transforms.length, 1, 0.15);

  // we create a palette of 5 colors, and duplicate them to match the number of transform
  // we also make sure that the colors have 0-1 components
  let colors = expandPalette(getBigQualitativePalette(5), transforms.length);
  colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);

  // we unzoom a little bit as a final transform
  const finalTransform = makeScaleFunction(0.8, 0.8);

  // initial points will be picked randomly
  const initialPointPicker = randomComplex;

  // plot the flame
  plotIfsFlame(path, width, height, transforms, randomInt, colors, initialPointPicker, finalTransform, nbPoints, nbIterations);
};


// the number of points is high, it can take a lot of time to get a picture
buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-seed=10-10moebius.png`, 2048, 2048, 10, 10, 10000, 100000);
buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-seed=20-15moebius.png`, 2048, 2048, 20, 15, 10000, 100000);
buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-seed=30-20moebius.png`, 2048, 2048, 30, 20, 10000, 100000);
