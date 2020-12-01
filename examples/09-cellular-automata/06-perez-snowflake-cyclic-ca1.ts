import { plot2dHexCA } from '../util';
import { mkdirs } from '../../utils/fs';
import { makePerezCyclicSnowflakeNextState } from '../../automata/cellular/perez-flake-cell';
import { expandPalette, BLUE_MOON } from '../../utils/palette';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotPerezFlakeCA = (path: string, width: number, height: number, maxState: number, aliveSums: number[], iterations = 10) => {
  // we create a palette of maxState colors, and duplicate them to match the number of transform
  const colors = expandPalette(BLUE_MOON, maxState);

  // we create the nextCellState function
  let nextCellState = null;
  if (aliveSums.length === 8) {
    nextCellState = makePerezCyclicSnowflakeNextState(maxState, aliveSums, true);
  } else {
    nextCellState = makePerezCyclicSnowflakeNextState(maxState, aliveSums, false);
  }

  // we create an initial state, with a living cell at the center
  const initialState = new Uint8Array(width * height).fill(0);
  initialState[Math.trunc(width / 2) + Math.trunc(height / 2) * width] = 1;

  // plot the cellular automaton
  plot2dHexCA(path, width, height, nextCellState, colors, iterations, initialState, 10, 0, 0);
};

buildAndPlotPerezFlakeCA(`${OUTPUT_DIRECTORY}/perez-flake-cyclic1.png`, 250, 250, 12, [ 0, 1, 0, 1, 1, 1, 1, 1 ], 100);
