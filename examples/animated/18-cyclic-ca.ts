import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import * as Easing from '../../utils/easing';
import { setRandomSeed, randomInteger } from '../../utils/random';
import { NeighborhoodReducer } from '../../automata/cellular/neighborhood';
import { plot2dCA } from '../util';
import { expandPalette, BLUE_MOON } from '../../utils/palette';
import { makeCyclicNextState } from '../../automata/cellular/cyclic-cell';
import { NeighborReducer, RenderFrameFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-cellular`;
mkdirs(OUTPUT_DIRECTORY);


export const makeAnimatedCyclicCA = (width: number, height: number, range: number, threshold: number, maxState: number, neighborReducer: NeighborReducer): RenderFrameFunction => {
  setRandomSeed(100);

  let colors = expandPalette(BLUE_MOON, maxState);
  colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);

  const nextCellState = makeCyclicNextState(maxState, range, threshold, neighborReducer);

  // every new call to the animation function will reuse the previous CA state
  let lastState = new Uint8Array(width * height).map(() => randomInteger(0, maxState));
  return async (iterations, _, path) => {
    lastState = await plot2dCA(path, width, height, nextCellState, colors, 1, lastState);
  };
};

animateFunction(makeAnimatedCyclicCA(1000, 1000, 1, 3, 3, NeighborhoodReducer.Moore), 0, 1000, Easing.linear, 1000, OUTPUT_DIRECTORY, 'cyclic-r=1-t=3-s=3-moore');
animateFunction(makeAnimatedCyclicCA(1000, 1000, 1, 3, 4, NeighborhoodReducer.Moore), 0, 4000, Easing.linear, 4000, OUTPUT_DIRECTORY, 'cyclic-r=1-t=3-s=4-moore');
animateFunction(makeAnimatedCyclicCA(1000, 1000, 1, 1, 14, NeighborhoodReducer.VonNeumann), 0, 300, Easing.linear, 300, OUTPUT_DIRECTORY, 'cyclic-r=1-t=1-s=14-vonneumann');
animateFunction(makeAnimatedCyclicCA(1000, 1000, 2, 4, 5, NeighborhoodReducer.Moore), 0, 1000, Easing.linear, 1000, OUTPUT_DIRECTORY, 'cyclic-r=2-t=4-s=5-moore');
animateFunction(makeAnimatedCyclicCA(1000, 1000, 5, 15, 6, NeighborhoodReducer.Moore), 0, 100, Easing.linear, 100, OUTPUT_DIRECTORY, 'cyclic-r=5-t=15-s=6-moore');
