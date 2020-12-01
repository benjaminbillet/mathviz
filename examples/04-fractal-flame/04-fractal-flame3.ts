import { generateTransformationSet } from '../../ifs/fractal-flame';
import { makeLinear, makeScaleFunction, makeSimpleLinear, makeSwirl, makeWave, makeIteratedMandelbrotFunction, makeJuliaScope } from '../../transform';
import { mixColorLinear } from '../../utils/color';
import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { mkdirs } from '../../utils/fs';
import { compose2dFunctions } from '../../utils/misc';
import { expandPalette, getBigQualitativePalette } from '../../utils/palette';
import { randomComplex, randomIntegerNormal, setRandomSeed } from '../../utils/random';
import { TransformMaker } from '../../utils/types';
import { plotIfsFlame } from '../util';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/fractal-flame`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotFlame = async (name: string, width: number, height: number, seed: string, nbTransformations: number, baseMakers: TransformMaker[], finalTransform = makeScaleFunction(0.1, 0.1), nbPoints = 1000, nbIterations = 1000) => {
  const path = `${OUTPUT_DIRECTORY}/${name}-t=${nbTransformations}-s=${seed}.png`

  // configure the PRNG
  setRandomSeed(seed);

  // we generate a set of transformations that will be picked according to a normal law
  const transforms = generateTransformationSet(nbTransformations, [ makeLinear ], baseMakers);
  const randomInt = randomIntegerNormal(0, transforms.length, 1, 0.15);

  // we create a palette of 5 colors, and duplicate them to match the number of transform
  const colors = expandPalette(getBigQualitativePalette(10), transforms.length);

  // initial points will be picked randomly
  const initialPointPicker = randomComplex;

  // plot the flame
  plotIfsFlame(path, width, height, transforms, randomInt, colors, initialPointPicker, finalTransform, nbPoints, nbIterations, BI_UNIT_DOMAIN, false, mixColorLinear, false);
};

// the number of points is high, it can take a lot of time to get a picture
buildAndPlotFlame('flame-linear-nonadditive.png', 2048, 2048, 'malachite', 10, [ makeSimpleLinear ], makeScaleFunction(0.1, 0.1), 50000, 2000);
buildAndPlotFlame('flame-linear-nonadditive.png', 2048, 2048, 'dioptase', 10, [ makeSimpleLinear ], makeScaleFunction(0.1, 0.1), 50000, 2000);
buildAndPlotFlame('flame-linear-nonadditive.png', 2048, 2048, 'tourmaline', 20, [ makeSimpleLinear ], makeScaleFunction(0.1, 0.1), 50000, 2000);
buildAndPlotFlame('flame-linear-nonadditive.png', 2048, 2048, 'aquamarine', 30, [ makeSimpleLinear ], makeScaleFunction(0.1, 0.1), 50000, 2000);

buildAndPlotFlame('flame-linear-nonadditive-ft=mandelbrot.png', 2048, 2048, 'malachite', 10, [ makeSimpleLinear ], compose2dFunctions(makeScaleFunction(0.5, 0.5), makeIteratedMandelbrotFunction(5, 10)), 100000, 1000);
buildAndPlotFlame('flame-swirl-nonadditive.png', 2048, 2048, 'malachite', 10, [ makeSwirl ], makeScaleFunction(0.2, 0.2), 50000, 2000);
buildAndPlotFlame('flame-wave-nonadditive.png', 2048, 2048, 'malachite', 10, [ makeWave ], makeScaleFunction(0.1, 0.1), 50000, 2000);
buildAndPlotFlame('flame-rings-nonadditive.png', 2048, 2048, 'malachite', 20, [ makeJuliaScope ], makeScaleFunction(0.3, 0.3), 50000, 2000);
