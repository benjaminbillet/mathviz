import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import * as Easing from '../../utils/easing';
import { setRandomSeed, randomInteger } from '../../utils/random';
import { generateCurlyCords } from '../../automata/curly-cords';
import { saveImageBuffer } from '../../utils/picture';
import { convertUnitToRGBA } from '../../utils/color';
import { RenderFrameFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-automata`;
mkdirs(OUTPUT_DIRECTORY);


export const makeAnimatedCurlyCord = (width: number, height: number, nbCords = 9, supersampling = 4): RenderFrameFunction => {
  const seed = randomInteger(100, 10000);
  return async (ratio, _, path) => {
    setRandomSeed(seed);
    const buffer = generateCurlyCords(width, height, nbCords, ratio, supersampling, ratio);
    await saveImageBuffer(convertUnitToRGBA(buffer), width, height, path);
  };
};

setRandomSeed(100);

animateFunction(makeAnimatedCurlyCord(1000, 1000, 9), 0, 1, Easing.linear, 100, OUTPUT_DIRECTORY, 'curly-cord1');
animateFunction(makeAnimatedCurlyCord(1000, 1000, 21), 0, 1, Easing.linear, 100, OUTPUT_DIRECTORY, 'curly-cord2');
