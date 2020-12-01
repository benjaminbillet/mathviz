import { plot1dCA } from '../util';
import { mkdirs } from '../../utils/fs';
import { randomInteger, setRandomSeed } from '../../utils/random';
import { CellularAutomataGrid, Color } from '../../utils/types';
import { buildElementaryRulesFromWolfranRuleCode, makeElementaryNextState } from '../../automata/cellular/elementary';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotElementaryCA = (width: number, height: number, wolframRuleCode: number) => {
  const path = `${OUTPUT_DIRECTORY}/rule${wolframRuleCode}-elementary-ca.png`;
  const colors: Color[] = [ [0,0,0,1], [1,1,1,1] ]

  // we create the nextCellState function
  const nextCellState = makeElementaryNextState(buildElementaryRulesFromWolfranRuleCode(wolframRuleCode));

  // we create a random initial state
  setRandomSeed('dioptase');
  const initialState: CellularAutomataGrid = new Uint8Array(width * height).map(() => randomInteger(0, 2));

  // plot the cellular automaton
  plot1dCA(path, width, height, nextCellState, colors, height - 1, initialState, 0, null);
};

const width = 512;
const height = 512;

buildAndPlotElementaryCA(width, height, 1);
buildAndPlotElementaryCA(width, height, 22);
buildAndPlotElementaryCA(width, height, 35);
buildAndPlotElementaryCA(width, height, 45);
buildAndPlotElementaryCA(width, height, 56);
buildAndPlotElementaryCA(width, height, 57);
buildAndPlotElementaryCA(width, height, 58);
buildAndPlotElementaryCA(width, height, 62);
buildAndPlotElementaryCA(width, height, 105);
buildAndPlotElementaryCA(width, height, 106);
buildAndPlotElementaryCA(width, height, 126);
buildAndPlotElementaryCA(width, height, 110);
buildAndPlotElementaryCA(width, height, 122);
buildAndPlotElementaryCA(width, height, 142);
buildAndPlotElementaryCA(width, height, 152);
buildAndPlotElementaryCA(width, height, 154);
buildAndPlotElementaryCA(width, height, 170);
buildAndPlotElementaryCA(width, height, 184);
