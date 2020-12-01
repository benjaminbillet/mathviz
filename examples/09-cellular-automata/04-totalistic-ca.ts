import { plot1dCA } from '../util';
import { mkdirs } from '../../utils/fs';
import { randomInteger, setRandomSeed } from '../../utils/random';
import { CellularAutomataGrid } from '../../utils/types';
import { buildTotalisticRulesFromWolframRuleCode, makeTotalisticNextState } from '../../automata/cellular/totalistic';
import { BLUE_MOON, expandPalette } from '../../utils/palette';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotTotalisticCA = (width: number, height: number, wolframRuleCode: number, nbState: number) => {
  const path = `${OUTPUT_DIRECTORY}/rule${wolframRuleCode}-n=${nbState}-totalistic-ca.png`;

  // we create a palette of maxState colors, and duplicate them to match the number of transform
  // we also make sure that the colors have 0-1 components
  const colors = expandPalette(BLUE_MOON, nbState);

  // we create the nextCellState function
  const nextCellState = makeTotalisticNextState(buildTotalisticRulesFromWolframRuleCode(wolframRuleCode, nbState));

  // we create a random initial state
  setRandomSeed('dioptase');
  const initialState: CellularAutomataGrid = new Uint8Array(width * height).map(() => randomInteger(0, nbState));
  // const initialState: CellularAutomataGrid = new Uint8Array(width * height).fill(0);
  // initialState[Math.trunc(width / 2)] = 1;

  // plot the cellular automaton
  plot1dCA(path, width, height, nextCellState, colors, height - 1, initialState, 0, null);
};

const width = 512;
const height = 512;


buildAndPlotTotalisticCA(width, height, 219, 3);
buildAndPlotTotalisticCA(width, height, 438, 3);
buildAndPlotTotalisticCA(width, height, 1380, 3);
buildAndPlotTotalisticCA(width, height, 1632, 3);
