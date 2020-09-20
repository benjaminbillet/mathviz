import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotFunction } from '../util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { SEA_FIRE } from '../../utils/palette';
import { makeMultiwave, makeBiunitColorFunction, makeMultipolar, makeStripped, composeWaveFunctions, makeRadialwave } from '../../misc/wave';
import { TWO_PI } from '../../utils/math';
import { makeColorMapFunction, buildSteppedColorMap } from '../../utils/color';
import { superellipse, manhattan, euclidean } from '../../utils/distance';
import { ComplexToRealFunction, RealToRealFunction, RenderFrameFunction } from '../../utils/types';

type Maker = (...args: any[]) => ComplexToRealFunction[];

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-waves`;
mkdirs(OUTPUT_DIRECTORY);

const stepColorizer = makeBiunitColorFunction(makeColorMapFunction(buildSteppedColorMap(SEA_FIRE), 255));

const makeAnimatedPhase = (maker: Maker, freq = 1, nbWaves = 1, stripeFreq = 1): RenderFrameFunction => {
  return async (phase, _, path) => {
    setRandomSeed(100);
    const func = makeStripped(maker(freq, nbWaves, phase, true), stripeFreq);
    await plotFunction(path, 1024, 1024, func, BI_UNIT_DOMAIN, stepColorizer, false);
  };
};

animateFunction(makeAnimatedPhase(makeMultiwave, 7, 7, 2), 0, TWO_PI, Easing.linear, 100, OUTPUT_DIRECTORY, 'multiwave-phase', 20);
animateFunction(makeAnimatedPhase(makeMultipolar, 5, 2, 5), 0, TWO_PI, Easing.linear, 100, OUTPUT_DIRECTORY, 'multipolar-phase', 20);


const makeAnimatedStripes = (maker: Maker, freq = 1, nbWaves = 1): RenderFrameFunction => {
  return async (stripeFreq, _, path) => {
    setRandomSeed(100);
    const func = makeStripped(maker(freq, nbWaves, 0, true), stripeFreq);
    await plotFunction(path, 1024, 1024, func, BI_UNIT_DOMAIN, stepColorizer, false);
  };
};

animateFunction(makeAnimatedStripes(makeMultiwave, 7, 7), 0.25, 4, Easing.linear, 100, OUTPUT_DIRECTORY, 'multiwave-stripes', 20);


const makeAnimatedCompositionPhase = (maker: Maker): RenderFrameFunction => {
  return async (phase, _, path) => {
    setRandomSeed(100);
    const func = composeWaveFunctions(maker(phase));
    await plotFunction(path, 1024, 1024, func, BI_UNIT_DOMAIN, stepColorizer, false);
  };
};

animateFunction(makeAnimatedCompositionPhase((phase: number) => ([
  makeStripped(makeMultiwave(7, 7, 0, true), 2),
  makeStripped(makeMultipolar(5, 2, phase, true), 5),
])), 0, TWO_PI, Easing.linear, 100, OUTPUT_DIRECTORY, 'composition1', 20);

animateFunction(makeAnimatedCompositionPhase((phase: number) => ([
  makeStripped(makeMultiwave(7, 7, 0, true), 2),
  makeRadialwave(1, phase, superellipse),
])), 0, TWO_PI, Easing.linear, 100, OUTPUT_DIRECTORY, 'composition2', 20);

animateFunction(makeAnimatedCompositionPhase((phase: number) => ([
  makeMultiwave(10, 4, 0, true),
  makeStripped(makeMultipolar(2, 3, phase, true), 5),
  makeRadialwave(4, phase, manhattan),
])), 0, TWO_PI, Easing.linear, 100, OUTPUT_DIRECTORY, 'composition3', 20);

animateFunction(makeAnimatedCompositionPhase((phase: number) => ([
  makeStripped(makeMultiwave(1, 2, 0, true), 9),
  makeRadialwave(3, phase, euclidean),
  makeRadialwave(4, phase, manhattan),
])), 0, TWO_PI, Easing.linear, 100, OUTPUT_DIRECTORY, 'composition4', 20);

