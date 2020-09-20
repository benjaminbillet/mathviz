import { plotSymmetrical2dHexCA } from './util';
import { mkdirs } from '../utils/fs';
import { setRandomSeed } from '../utils/random';
import { makeProbabilisticWolframCrystalNextState } from '../automata/cellular/wolfram-crystal-cell';
import { Color } from '../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);


const buildAndPlotWolframCrystalCA = async (path: string, width: number, height: number, seed: number, birthProbabilities: number[], deathProbabilities: number[], iterations = 10) => {
  // configure the PRNG
  setRandomSeed(seed);

  // 0 = dead cell (uncolored), 1 = alive cell (colored)
  const colors: Color[] = [ [ 0, 0, 0 ], [ 0, 1, 1 ] ];

  // we create the nextCellState function
  // if there is 8 probabilities, we know that we have to include the center cell in neighborhood summing
  let nextCellState = null;
  if (birthProbabilities.length === 8 && deathProbabilities.length === 8) {
    nextCellState = makeProbabilisticWolframCrystalNextState(birthProbabilities, deathProbabilities, true);
  } else {
    nextCellState = makeProbabilisticWolframCrystalNextState(birthProbabilities, deathProbabilities, false);
  }

  // we create an initial state, with a living cell at the center
  const initialState = new Uint8Array(width * height).fill(0);
  initialState[Math.trunc(width / 2) + Math.trunc(height / 2) * width] = 1;

  // plot the cellular automaton
  await plotSymmetrical2dHexCA(path, width, height, nextCellState, colors, iterations, initialState, 10, 0, 0);
};

const NO_DEATH_PROBAS = [ 0, 0, 0, 0, 0, 0, 0 ];

// using 0 and 1 values, we can create regular automaton, e.g., the regular wolfram crystal
// buildAndPlotWolframCrystalCA(`${OUTPUT_DIRECTORY}/wolfram-crystal-regular.png`, 100, 100, 0, [ 0, 1, 0, 0, 0, 0, 0 ], NO_DEATH_PROBAS, 30);

const SNOWFLAKES_BIRTH_PROBAS = [ 0, 0.5, 0, 0.1, 0, 0, 0.1 ];
for (let i = 0; i < 1000; i += 100) {
  buildAndPlotWolframCrystalCA(`${OUTPUT_DIRECTORY}/wolfram-crystal-probabilistic-nodeath-seed=${i}.png`, 100, 100, i, SNOWFLAKES_BIRTH_PROBAS, NO_DEATH_PROBAS, 50);
}

const SNOWFLAKES_DEATH_PROBAS = [ 0, 0, 0, 0.05, 0.1, 0.25, 0.5 ];
for (let i = 0; i < 1000; i += 100) {
  buildAndPlotWolframCrystalCA(`${OUTPUT_DIRECTORY}/wolfram-crystal-probabilistic-death-seed=${i}.png`, 100, 100, i, SNOWFLAKES_BIRTH_PROBAS, SNOWFLAKES_DEATH_PROBAS, 50);
}
