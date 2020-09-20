import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { HexagonalNeighborhoodReducer } from '../../automata/cellular/neighborhood';
import { plot2dHexCA } from '../util';
import { expandPalette, BLUE_MOON } from '../../utils/palette';
import { makePerezCyclicSnowflakeNextState2 } from '../../automata/cellular/perez-flake-cell';
import { NeighborReducer, RenderFrameFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-cellular`;
mkdirs(OUTPUT_DIRECTORY);


export const makeAnimatedPerezFlakeCCA = (width: number, height: number, maxState: number, aliveSums: number[], neighborReducer: NeighborReducer, range: number): RenderFrameFunction => {
  setRandomSeed(100);

  let colors = expandPalette(BLUE_MOON, maxState);
  colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);

  const nextCellState = makePerezCyclicSnowflakeNextState2(maxState, aliveSums, false, neighborReducer, range);

  // every new call to the animation function will reuse the previous CA state
  let lastState = new Uint8Array(width * height).fill(0);
  lastState[Math.trunc(width / 2) + Math.trunc(height / 2) * width] = 1;

  return async (iterations, _, path) => {
    if (iterations === 0) {
      await plot2dHexCA(path, width, height, nextCellState, colors, 0, lastState, 10, 0, 0);
    } else {
      lastState = await plot2dHexCA(path, width, height, nextCellState, colors, 1, lastState, 10, 0, 0);
    }
  };
};

//animateFunction(makeAnimatedPerezFlakeCCA(250, 250, 12, [ 0, 1, 0, 1, 0, 0, 1 ], HexagonalNeighborhoodReducer.VonNeumann, 1), 0, 80, Easing.linear, 80, OUTPUT_DIRECTORY, 'perez-flake-cyclic2-vonneumann', 10);
//animateFunction(makeAnimatedPerezFlakeCCA(250, 250, 12, [ 0, 1, 0, 1, 0, 0, 1 ], HexagonalNeighborhoodReducer.Moore, 1), 0, 50, Easing.linear, 50, OUTPUT_DIRECTORY, 'perez-flake-cyclic2-moore', 10);
//animateFunction(makeAnimatedPerezFlakeCCA(250, 250, 12, [ 0, 1, 0, 1, 0, 0, 1 ], HexagonalNeighborhoodReducer.Moore, 2), 0, 30, Easing.linear, 30, OUTPUT_DIRECTORY, 'perez-flake-cyclic2-moore-r=2', 10);
animateFunction(makeAnimatedPerezFlakeCCA(250, 250, 12, [ 0, 1, 0, 1, 0, 0, 1 ], HexagonalNeighborhoodReducer.FullStar, 2), 0, 45, Easing.linear, 45, OUTPUT_DIRECTORY, 'perez-flake-cyclic2-fullstar-r=2', 10);
