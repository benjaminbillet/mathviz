import { mkdirs } from '../../utils/fs';
import { randomInteger, setRandomSeed } from '../../utils/random';
import { NeighborhoodReducer } from  '../../automata/cellular/neighborhood';
import { makeCyclicNextState2d } from '../../automata/cellular/cyclic-cell';
import { CellularAutomataGrid, NeighborReducer } from '../../utils/types';
import { makeWingedCarlsonTiles, WINGED_CARLSON_TILE_SIZE } from '../../tiling/tiles/winged-carlson';
import { KRAWCZYK_PATHS_TILE_SIZE, makeKrawczykPathsTiles } from '../../tiling/tiles/krawczyk-paths';
import { expandArray, ExpandMode, shuffleArray } from '../../utils/misc';
import { plot2dMultistateCASvg } from '../util';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);


const buildAndPlotCyclicCA = async (path: string, width: number, height: number, makeTiles, tileSize, range: number, threshold: number, maxState: number, neighborReduceFunc: NeighborReducer, iterations = 100) => {
  setRandomSeed('dioptase');

  // we create a palette of maxState colors, and duplicate them to match the number of transform
  const colors = new Array(maxState).fill([ 1,1,1,1 ]);

  // we create the nextCellState function
  const nextCellState = makeCyclicNextState2d(maxState, range, threshold, neighborReduceFunc);

  // we create a random initial state
  const initialState: CellularAutomataGrid = new Uint8Array(width * height).map(() => randomInteger(0, maxState));

  const shuffledMakeTiles = (scale, plotter) => shuffleArray(expandArray(makeTiles(scale, plotter), maxState, ExpandMode.ROTATE));

  // plot the cellular automaton
  await plot2dMultistateCASvg(path, width, height, 3000, 3000, nextCellState, colors, shuffledMakeTiles, iterations, initialState, tileSize);
};

// the number of points is high, it can take a lot of time to get a picture
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/multistate-truchet-carlson-ca-r=1-t=1-s=14-vonneumann.png`, 100, 100, (scale, plotter) => makeWingedCarlsonTiles(scale, [0,0,0,1], [1,1,1,1], plotter), WINGED_CARLSON_TILE_SIZE, 1, 1, 14, NeighborhoodReducer.VonNeumann, 300);
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/multistate-truchet-krawczyk-ca-r=1-t=1-s=14-vonneumann.png`, 100, 100, makeKrawczykPathsTiles, KRAWCZYK_PATHS_TILE_SIZE, 1, 1, 14, NeighborhoodReducer.VonNeumann, 300);

buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/multistate-truchet-carlson-ca-r=2-t=4-s=5-moore.png`, 100, 100, (scale, plotter) => makeWingedCarlsonTiles(scale, [0,0,0,1], [1,1,1,1], plotter), WINGED_CARLSON_TILE_SIZE, 2, 4, 5, NeighborhoodReducer.Moore, 2000);
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/multistate-truchet-carlson-ca-r=5-t=15-s=6-moore.png`, 100, 100, (scale, plotter) => makeWingedCarlsonTiles(scale, [0,0,0,1], [1,1,1,1], plotter), WINGED_CARLSON_TILE_SIZE, 5, 15, 6, NeighborhoodReducer.Moore, 200);

buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/multistate-truchet-carlson-ca-r=2-t=2-s=6-vonneumann.png`, 100, 100, (scale, plotter) => makeWingedCarlsonTiles(scale, [0,0,0,1], [1,1,1,1], plotter), WINGED_CARLSON_TILE_SIZE, 2, 2, 6, NeighborhoodReducer.VonNeumann, 1000);
buildAndPlotCyclicCA(`${OUTPUT_DIRECTORY}/multistate-krawczyk-carlson-ca-r=2-t=2-s=6-vonneumann.png`, 100, 100, makeKrawczykPathsTiles, KRAWCZYK_PATHS_TILE_SIZE, 2, 2, 6, NeighborhoodReducer.VonNeumann, 1000);
