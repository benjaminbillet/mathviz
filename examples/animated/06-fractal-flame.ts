import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotIfsFlame } from '../util';
import * as Easing from '../../utils/easing';
import { setRandomSeed, randomIntegerNormal, randomComplex } from '../../utils/random';
import { complex } from '../../utils/complex';
import { compose2dFunctions } from '../../utils/misc';
import { getBigQualitativePalette, expandPalette } from '../../utils/palette';
import { makeScaleFunction, makeLinear } from '../../transform';
import { TWO_PI } from '../../utils/math';
import { RenderFrameFunction, Transform2D } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-fractalflame`;
mkdirs(OUTPUT_DIRECTORY);


setRandomSeed(100);

const makeSinusoidal = (phase: number): Transform2D => {
  return (z) => complex(Math.sin(z.re + phase), Math.sin(z.im + phase));
};

const baseTransforms = new Array(15).fill(null).map(() => makeLinear());
const getTransformations = (phase: number) => {
  return baseTransforms.map(base => compose2dFunctions(base, makeSinusoidal(phase)));
};

const buildAndPlotFlame = async (path: string, width: number, height: number, phase: number, nbPoints: number, nbIterations: number) => {
  setRandomSeed(100);

  // we generate a set of transformations that will be picked according to a normal law
  const transforms = getTransformations(phase);
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
  await plotIfsFlame(path, width, height, transforms, randomInt, colors, initialPointPicker, finalTransform, nbPoints, nbIterations);
};

const functionToAnimate: RenderFrameFunction = async (phase, _, path) => {
  await buildAndPlotFlame(path, 1024, 1024, phase, 5000, 10000);
};

animateFunction(functionToAnimate, 0, TWO_PI, Easing.linear, 100, OUTPUT_DIRECTORY, 'flame', 20);

