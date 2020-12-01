import { generateTransformationSet } from '../../ifs/fractal-flame';
import { makeBubble, makeEpitrochoid, makeEx, makeFan, makeHandkerchief, makeHypocycloid, makeJulia, makeLinear, makePDJ, makePopCorn, makeScaleFunction, makeTranslation, makeWave } from '../../transform';
import { makeUniformScale } from '../../transform/uniformScale';
import { mkdirs } from '../../utils/fs';
import { expandPalette, getBigQualitativePalette } from '../../utils/palette';
import { randomComplex, randomIntegerNormal, setRandomSeed } from '../../utils/random';
import { TransformMaker } from '../../utils/types';
import { plotIfsFlame } from '../util';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/fractal-flame`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotFlame = async (name: string, width: number, height: number, seed: string, nbTransformations: number, makers: TransformMaker[], baseMakers: TransformMaker[], nbPoints: number, nbIterations: number) => {
  const path = `${OUTPUT_DIRECTORY}/${name}-t=${nbTransformations}-s=${seed}.png`

  // configure the PRNG
  setRandomSeed(seed);

  // we generate a set of transformations that will be picked according to a normal law
  const transforms = generateTransformationSet(nbTransformations, makers, baseMakers);
  const randomInt = randomIntegerNormal(0, transforms.length, 1, 0.15);

  // we create a palette of 5 colors, and duplicate them to match the number of transform
  const colors = expandPalette(getBigQualitativePalette(5), transforms.length);

  // we unzoom a little bit as a final transform
  const finalTransform = makeScaleFunction(0.8, 0.8);

  // initial points will be picked randomly
  const initialPointPicker = randomComplex;

  // plot the flame
  plotIfsFlame(path, width, height, transforms, randomInt, colors, initialPointPicker, finalTransform, nbPoints, nbIterations);
};

// the number of points is high, it can take a lot of time to get a picture
/*buildAndPlotFlame('flame-sinusoidal', 2048, 2048, 'tourmaline', 5, [ makeSinusoidal ], [ makeLinear ], 10000, 100000);
buildAndPlotFlame('flame-sinusoidal', 2048, 2048, 'dioptase', 10, [ makeSinusoidal ], [ makeLinear ], 10000, 100000);
buildAndPlotFlame('flame-sinusoidal', 2048, 2048, 'rhodochrosite', 15, [ makeSinusoidal ], [ makeLinear ], 10000, 100000);
buildAndPlotFlame('flame-sinusoidal', 2048, 2048, 'amethyst', 20, [ makeSinusoidal ], [ makeLinear ], 10000, 100000);

buildAndPlotFlame('flame-mobius', 2048, 2048, 'dioptase', 10, [ makeMobius, makeSimpleLinear ], [ makeLinear ], 10000, 100000);
buildAndPlotFlame('flame-mobius', 2048, 2048, 'tourmaline', 20, [ makeMobius, makeSimpleLinear ], [ makeLinear ], 10000, 100000);
buildAndPlotFlame('flame-mobius', 2048, 2048, 'amethyst', 30, [ makeMobius, makeSimpleLinear ], [ makeLinear ], 10000, 100000);
buildAndPlotFlame('flame-mobius', 2048, 2048, 'malachite', 40, [ makeMobius, makeSimpleLinear ], [ makeLinear ], 10000, 100000);*/

buildAndPlotFlame('flame-wave-scale--bubble', 2048, 2048, 'dioptase', 10, [ makeWave, makeUniformScale ], [ makeBubble ], 10000, 100000);
buildAndPlotFlame('flame-popcorn-hypocycloid--uscale-translation', 2048, 2048, 'rhodochrosite', 30, [ makePopCorn, makeHypocycloid ], [ makeUniformScale, makeTranslation ], 1000, 100000);
buildAndPlotFlame('flame-epitrochoid--pdj', 2048, 2048, 'rhodochrosite', 30, [ makeEpitrochoid ], [ makePDJ ], 10000, 100000);
buildAndPlotFlame('flame-ex-fan-julia-handkerchief--fan', 2048, 2048, 'tourmaline', 20, [ makeEx, makeFan, makeJulia, makeHandkerchief ], [ makeLinear, makeFan ], 10000, 100000);