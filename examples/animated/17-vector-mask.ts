import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { saveImageBuffer } from '../../utils/picture';
import { convertUnitToRGBA } from '../../utils/color';
import { generateVectorMask } from '../../automata/vector-mask';
import { RenderFrameFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-automata`;
mkdirs(OUTPUT_DIRECTORY);


export const makeAnimatedVectorMask = (width: number, height: number, nbLayers: number, seed: number): RenderFrameFunction => {
  return async (iterations, _, path) => {
    setRandomSeed(seed);
    const buffer = generateVectorMask(width, height, nbLayers, iterations);
    await saveImageBuffer(convertUnitToRGBA(buffer), width, height, path);
  };
};

animateFunction(makeAnimatedVectorMask(1000, 1000, 1, 100), 0, 1000, Easing.linear, 100, OUTPUT_DIRECTORY, 'vector-mask1');
animateFunction(makeAnimatedVectorMask(1000, 1000, 1, 200), 0, 1000, Easing.linear, 100, OUTPUT_DIRECTORY, 'vector-mask2');
animateFunction(makeAnimatedVectorMask(1000, 1000, 1, 300), 0, 1000, Easing.linear, 100, OUTPUT_DIRECTORY, 'vector-mask3');

animateFunction(makeAnimatedVectorMask(1000, 1000, 3, 300), 0, 1000, Easing.linear, 100, OUTPUT_DIRECTORY, 'vector-mask3');
