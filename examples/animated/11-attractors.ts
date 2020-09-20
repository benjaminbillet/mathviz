import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotAttractor } from '../util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { BI_UNIT_DOMAIN, scaleDomain } from '../../utils/domain';
import { CATERPILLAR, BLUE_MOON } from '../../utils/palette';
import { makeMixedColorSteal } from '../../ifs/fractal-flame';
import { complex } from '../../utils/complex';
import { getPictureSize } from '../../utils/picture';
import { makeHopalong, makeThreePly } from '../../attractors/hopalong';
import { RenderFrameFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-attractors`;
mkdirs(OUTPUT_DIRECTORY);

const nbIterations = 1000000;

const makeAnimatedHopalong = (a: number, b: number, c: number, domainScale: number): RenderFrameFunction => {
  const initialPointPicker = () => complex(0, 0);
  const domain = scaleDomain(BI_UNIT_DOMAIN, domainScale);
  const [ width, height ] = getPictureSize(1024, domain, true);
  const colorFunc = makeMixedColorSteal(CATERPILLAR, domain.xmax, nbIterations, 0.5, 0.5);
  const attractor = makeHopalong(a, b, c);
  return async (iterations, _, path) => {
    setRandomSeed(100);
    await plotAttractor(path, width, height, attractor, initialPointPicker, colorFunc, Math.trunc(iterations), domain);
  };
};

const makeAnimatedThreePly = (a: number, b: number, c: number, domainScale: number): RenderFrameFunction => {
  const initialPointPicker = () => complex(0, 0);
  const domain = scaleDomain(BI_UNIT_DOMAIN, domainScale);
  const [ width, height ] = getPictureSize(1024, domain, true);
  const colorFunc = makeMixedColorSteal(BLUE_MOON, domain.xmax, nbIterations, 0.5, 0.5);
  const attractor = makeThreePly(a, b, c);
  return async (iterations, _, path) => {
    setRandomSeed(100);
    await plotAttractor(path, width, height, attractor, initialPointPicker, colorFunc, Math.trunc(iterations), domain);
  };
};

animateFunction(makeAnimatedHopalong(2, -1, 200, 865), 100, 5000000, Easing.quarticIn, 500, OUTPUT_DIRECTORY, 'hopalong1', 20);
animateFunction(makeAnimatedHopalong(1.1, 0.5, 1, 35), 100, 5000000, Easing.quarticIn, 500, OUTPUT_DIRECTORY, 'hopalong2', 20);
animateFunction(makeAnimatedThreePly(-79, -2, -76, 5780), 100, 5000000, Easing.quarticIn, 500, OUTPUT_DIRECTORY, 'three-ply1', 20);
