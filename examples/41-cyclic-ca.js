import { plotCyclicCA } from './util';
import { mkdirs } from '../utils/fs';
import { setRandomSeed } from '../utils/random';
import { expandPalette, BLUE_MOON } from '../utils/palette';
import { NeighborhoodReducer } from  '../automata/cellular/neighborhood';

const OUTPUT_DIRECTORY = `${__dirname}/../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotCA = async (path, width, height, seed, range, threshold, maxState, neighborReduceFunc, iterations = 100) => {
  // configure the PRNG
  setRandomSeed(seed);

  // we create a palette of maxState colors, and duplicate them to match the number of transform
  // we also make sure that the colors have 0-1 components
  let colors = expandPalette(BLUE_MOON, maxState);
  colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);

  // plot the flame
  await plotCyclicCA(path, width, height, colors, range, threshold, maxState, neighborReduceFunc, iterations);
};

// the number of points is high, it can take a lot of time to get a picture
buildAndPlotCA(`${OUTPUT_DIRECTORY}/cyclic-r=1-t=3-s=3-moore.png`, 1024, 1024, 0, 1, 3, 3, NeighborhoodReducer.Moore, 1000);
buildAndPlotCA(`${OUTPUT_DIRECTORY}/cyclic-r=1-t=3-s=4-moore.png`, 1024, 1024, 0, 1, 3, 4, NeighborhoodReducer.Moore, 5000);
buildAndPlotCA(`${OUTPUT_DIRECTORY}/cyclic-r=1-t=1-s=14-vonneumann.png`, 1024, 1024, 0, 1, 1, 14, NeighborhoodReducer.VonNeumann, 300);
buildAndPlotCA(`${OUTPUT_DIRECTORY}/cyclic-r=2-t=4-s=5-moore.png`, 1024, 1024, 0, 2, 4, 5, NeighborhoodReducer.Moore, 1000);
buildAndPlotCA(`${OUTPUT_DIRECTORY}/cyclic-r=5-t=15-s=6-moore.png`, 1024, 1024, 0, 5, 15, 6, NeighborhoodReducer.Moore, 100);
