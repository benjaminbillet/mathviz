import { plot2dHexCA } from './util';
import { mkdirs } from '../utils/fs';
import { setRandomSeed } from '../utils/random';
import { makeWolframCrystalNextState } from '../automata/cellular/wolfram-crystal-ca';

const OUTPUT_DIRECTORY = `${__dirname}/../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotCrystalGrowthCA = async (path, width, height, seed, iterations = 10) => {
  // configure the PRNG
  setRandomSeed(seed);

  // 0 = dead cell (uncolored), 1 = alive cell (colored)
  const colors = [ [ 0, 0, 0 ], [ 0, 1, 1 ] ];

  // we create the nextCellState function
  const nextCellState = makeWolframCrystalNextState();

  // we create an initial state, with a living cell at the center
  const initialState = new Uint8Array(width * height).fill(0);
  initialState[Math.trunc(width / 2) + Math.trunc(height / 2) * width] = 1;

  // plot the flame
  await plot2dHexCA(path, width, height, nextCellState, colors, iterations, initialState, 0);
};

buildAndPlotCrystalGrowthCA(`${OUTPUT_DIRECTORY}/crystal-growth-vonneumann.png`, 100, 100, 0, 30);
