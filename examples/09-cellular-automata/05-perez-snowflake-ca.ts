import { plot2dHexCA } from '../util';
import { mkdirs } from '../../utils/fs';
import { makePerezSnowflakeNextState } from '../../automata/cellular/perez-flake-cell';
import { Color } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotPerezFlakeCA = (path: string, width: number, height: number, aliveSums: number[], iterations = 10) => {
  // 0 = dead cell (uncolored), 1 = alive cell (colored)
  const colors: Color[] = [ [ 0, 0, 0, 1 ], [ 0, 1, 1, 1 ] ];

  // we create the nextCellState function
  const nextCellState = makePerezSnowflakeNextState(aliveSums);

  // we create an initial state, with a living cell at the center
  const initialState = new Uint8Array(width * height).fill(0);
  initialState[Math.trunc(width / 2) + Math.trunc(height / 2) * width] = 1;

  // plot the cellular automaton
  plot2dHexCA(path, width, height, nextCellState, colors, iterations, initialState, 10, 3, 0);
};

buildAndPlotPerezFlakeCA(`${OUTPUT_DIRECTORY}/perez-flake1-original.png`, 150, 150, [ 0, 1, 1, 0, 0, 0, 0, 0 ], 51);
buildAndPlotPerezFlakeCA(`${OUTPUT_DIRECTORY}/perez-flake2.png`, 150, 150, [ 0, 1, 0, 0, 1, 0, 0, 1 ], 51);
buildAndPlotPerezFlakeCA(`${OUTPUT_DIRECTORY}/perez-flake3.png`, 150, 150, [ 0, 1, 1, 0, 0, 1, 0, 1 ], 51);
