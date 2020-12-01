import { generateTransformationSet } from '../../ifs/fractal-flame';
import { makeBent, makeCardioid, makeCpow, makeHypocycloid, makeJuliaScope, makeLinear, makeMobius, makeRays, makeScaleFunction, makeSinusoidal, makeSpiral, makeTranslation, makeTwintrian } from '../../transform';
import { mkdirs } from '../../utils/fs';
import { expandPalette, getBigQualitativePalette } from '../../utils/palette';
import { randomComplex, randomIntegerNormal, setRandomSeed } from '../../utils/random';
import { TransformMaker } from '../../utils/types';
import { plotIfsFlame } from '../util';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/fractal-flame`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotFlame = async (name: string, width: number, height: number, seed: string, nbTransformations: number, makers: TransformMaker[], nbPoints: number, nbIterations: number) => {
  const path = `${OUTPUT_DIRECTORY}/${name}-t=${nbTransformations}-s=${seed}.png`

  // configure the PRNG
  setRandomSeed(seed);

  // we generate a set of transformations that will be picked according to a normal law
  const transforms = generateTransformationSet(nbTransformations, makers);
  const randomInt = randomIntegerNormal(0, transforms.length, 1, 0.15);

  // we create a palette of 5 colors, and duplicate them to match the number of transform
  const colors = expandPalette(getBigQualitativePalette(5), transforms.length);

  // we unzoom a little bit as a final transform
  const finalTransform = makeScaleFunction(0.5, 0.5);

  // initial points will be picked randomly
  const initialPointPicker = randomComplex;

  // plot the flame
  plotIfsFlame(path, width, height, transforms, randomInt, colors, initialPointPicker, finalTransform, nbPoints, nbIterations);
};

// the number of points is high, it can take a lot of time to get a picture
buildAndPlotFlame('flame-mobius-sinusoidal', 2048, 2048, 'dioptase', 10, [ makeMobius, makeSinusoidal ], 10000, 100000);
buildAndPlotFlame('flame-mobius-sinusoidal', 2048, 2048, 'malachite', 10, [ makeMobius, makeSinusoidal ], 10000, 100000);
buildAndPlotFlame('flame-mobius-sinusoidal', 2048, 2048, 'rhodochrosite', 15, [ makeMobius, makeSinusoidal ], 10000, 100000);
buildAndPlotFlame('flame-mobius-sinusoidal', 2048, 2048, 'tourmaline', 20, [ makeMobius, makeSinusoidal ], 10000, 100000);

buildAndPlotFlame('flame-mobius-linear', 2048, 2048, 'rhodochrosite', 10, [ makeMobius, makeLinear ], 10000, 100000);
buildAndPlotFlame('flame-mobius-linear-juliascope', 2048, 2048, 'rhodochrosite', 30, [ makeLinear, makeMobius, makeJuliaScope ], 10000, 100000);
buildAndPlotFlame('flame-mobius-hypocycloid-twintrian-wave', 2048, 2048, 'rhodochrosite', 15, [ makeHypocycloid, makeTwintrian, makeMobius ], 10000, 100000);
buildAndPlotFlame('flame-mobius-spiral-translation', 2048, 2048, 'rhodochrosite', 20, [ makeMobius, makeSpiral, makeSpiral, makeTranslation ], 10000, 100000);
buildAndPlotFlame('flame-mobius-cardiod-rays-bent-cpow', 2048, 2048, 'rhodochrosite', 30, [ makeMobius, makeCardioid, makeRays, makeBent, makeCpow ], 10000, 100000);
