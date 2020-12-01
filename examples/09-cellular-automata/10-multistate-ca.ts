import { mkdirs } from '../../utils/fs';
import { reduceVonNeumannHexagonalNeighbor } from '../../automata/cellular/neighborhood';
import { HEXAGON_RADIUS, makeStateStyles } from '../../automata/cellular/state-styles';
import { AUTUMN, BOAT, expandPalette, getTintPalette, OPAL } from '../../utils/palette';
import { shuffleArray } from '../../utils/misc';
import { CellularAutomataGrid, Color, Palette } from '../../utils/types';
import { setRandomSeed } from '../../utils/random';
import { plot2dHexMultistateCASvg } from '../util';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

const nextCellState = (stateGrid: CellularAutomataGrid, gridWidth: number, gridHeight: number, currentState: number, x: number, y: number) => {
  const sum = reduceVonNeumannHexagonalNeighbor(stateGrid, gridWidth, gridHeight, x, y, 1, (total, neighborState) => {
    return total + neighborState;
  }, 0);
  if (sum >= 64) {
    return 0;
  }
  return sum;
  // return sum % 64;
};

const buildAndPlotMultistateCA = async (seed: string, palette: Palette, width: number, height: number, iterations = 10) => {
  setRandomSeed(seed);
  const path = `${OUTPUT_DIRECTORY}/multistate-ca-s=${seed}.png`;

  // 0 = dead cell (uncolored), 1 = alive cell (colored)
  const colors: Color[] = [
    [ 0, 0, 0, 1 ],
    ...expandPalette(palette, 63)
  ];
  // we create an initial state, with a living cell at the center
  const initialState = new Uint8Array(width * height).fill(0);
  initialState[Math.trunc(width / 2) + Math.trunc(height / 2) * width] = 1;

  // for each state, we have a different shape drawing procedure
  const makeTiles = (scale, canvasPlotter) => [
    () => {}, // state 0 = dead cell
    ...shuffleArray(makeStateStyles(scale, canvasPlotter))
  ];

  // plot the cellular automaton
  await plot2dHexMultistateCASvg(path, width, height, 3000, 3000, nextCellState, colors, makeTiles, iterations, initialState, HEXAGON_RADIUS, 1, 2, 0);
};

buildAndPlotMultistateCA('dioptase', OPAL, 75, 75, 35);
buildAndPlotMultistateCA('malachite', getTintPalette([ 0, 0.3, 0.3, 1], 20), 75, 75, 35);
buildAndPlotMultistateCA('rhodochrosite', AUTUMN, 75, 75, 35);
buildAndPlotMultistateCA('aquamarine', BOAT, 75, 75, 35);
