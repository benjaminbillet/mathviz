import { plot2dCA } from '../util';
import { mkdirs } from '../../utils/fs';
import { randomInteger, setRandomSeed } from '../../utils/random';
import { expandPalette, BLUE_MOON } from '../../utils/palette';
import { NeighborhoodReducer } from  '../../automata/cellular/neighborhood';
import { makeCyclicNextState2d } from '../../automata/cellular/cyclic-cell';
import { CellularAutomataGrid, NeighborReducer } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotCyclicCA = (path: string, width: number, height: number, range: number, threshold: number, maxState: number, neighborReduceFunc: NeighborReducer, iterations = 100) => {
  // we create a palette of maxState colors, and duplicate them to match the number of transform
  // we also make sure that the colors have 0-1 components
  const colors = expandPalette(BLUE_MOON, maxState);

  // we create the nextCellState function
  const nextCellState = makeCyclicNextState2d(maxState, range, threshold, neighborReduceFunc);

  // we create a random initial state
  setRandomSeed('dioptase');
  const initialState: CellularAutomataGrid = new Uint8Array(width * height).map(() => randomInteger(0, maxState));

  // plot the cellular automaton
  plot2dCA(path, width, height, nextCellState, colors, iterations, initialState, null);
};

// the number of points is high, it can take a lot of time to get a picture
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/cyclic2d-r=1-t=3-s=3-moore.png`, 1024, 1024, 1, 3, 3, NeighborhoodReducer.Moore, 1000);
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/cyclic2d-r=1-t=3-s=4-moore.png`, 1024, 1024, 1, 3, 4, NeighborhoodReducer.Moore, 5000);
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/cyclic2d-r=1-t=1-s=14-vonneumann.png`, 1024, 1024, 1, 1, 14, NeighborhoodReducer.VonNeumann, 300);
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/cyclic2d-r=2-t=4-s=5-moore.png`, 1024, 1024, 2, 4, 5, NeighborhoodReducer.Moore, 1000);
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/cyclic2d-r=5-t=15-s=6-moore.png`, 1024, 1024, 5, 15, 6, NeighborhoodReducer.Moore, 100);
