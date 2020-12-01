import { plot2dHexCA } from '../util';
import { mkdirs } from '../../utils/fs';
import { makeWolframCrystalNextState } from '../../automata/cellular/wolfram-crystal-cell';
import { Color } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotWolframCrystalCA = (path: string, width: number, height: number, iterations = 10) => {
  // 0 = dead cell (uncolored), 1 = alive cell (colored)
  const colors: Color[] = [ [ 0, 0, 0, 1 ], [ 0, 1, 1, 1 ] ];

  // we create the nextCellState function
  const nextCellState = makeWolframCrystalNextState();

  // we create an initial state, with a living cell at the center
  const initialState = new Uint8Array(width * height).fill(0);
  initialState[Math.trunc(width / 2) + Math.trunc(height / 2) * width] = 1;

  // plot the cellular automaton
  plot2dHexCA(path, width, height, nextCellState, colors, iterations, initialState, 10, 3, 0);
};

for (let i = 0; i < 30; i++) {
  buildAndPlotWolframCrystalCA(`${OUTPUT_DIRECTORY}/wolfram-crystal-step${i+1}.png`, 80, 80, i);
}
