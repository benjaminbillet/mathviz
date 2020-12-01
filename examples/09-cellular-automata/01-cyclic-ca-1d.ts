import { plot1dCA } from '../util';
import { mkdirs } from '../../utils/fs';
import { randomInteger, setRandomSeed } from '../../utils/random';
import { expandPalette, BOAT } from '../../utils/palette';
import { makeCyclicNextState1d } from '../../automata/cellular/cyclic-cell';
import { CellularAutomataGrid } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotCyclicCA = (path: string, width: number, height: number, range: number, threshold: number, maxState: number) => {
  // we create a palette of maxState colors, and duplicate them to match the number of transform
  // we also make sure that the colors have 0-1 components
  const colors = expandPalette(BOAT, maxState);

  // we create the nextCellState function
  const nextCellState = makeCyclicNextState1d(maxState, range, threshold);

  // we create a random initial state
  setRandomSeed('dioptase');
  const initialState: CellularAutomataGrid = new Uint8Array(width * height).map(() => randomInteger(0, maxState));

  // plot the cellular automaton
  plot1dCA(path, width, height, nextCellState, colors, height - 1, initialState, 0, null);
};

buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/cyclic1d-r=1-t=1-s=4.png`, 512, 512, 1, 1, 4);
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/cyclic1d-r=4-t=3-s=4.png`, 512, 512, 4, 3, 4);
