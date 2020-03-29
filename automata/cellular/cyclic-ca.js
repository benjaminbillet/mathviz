import { randomInteger } from '../../utils/random';
import { getNextAutomatonState, makeCyclicNextState } from './2d-automaton';
import { makePixelToComplexPlotter } from '../../utils/plotter';

export const plotCyclicCellularAutomaton = (plotter, gridWidth, gridHeight, colors, range, threshold, maxState, neighborReduceFunc, iterations = 100, initialState = null) => {
  // create a grid of cells, based on the initial state, or randomized [0, maxState[
  let grid = new Uint8Array(gridWidth * gridHeight).fill(0);
  if (initialState != null) {
    if (initialState.length !== grid.length) {
      throw new Error('invalid initial state');
    }
    grid.set(initialState);
  } else {
    grid = grid.map(() => randomInteger(0, maxState));
  }

  const nextGrid = new Float32Array(grid.length).fill(0);
  const cyclicNextStateFunc = makeCyclicNextState(maxState, range, threshold, neighborReduceFunc);

  for (let i = 0; i < iterations; i++) {
    getNextAutomatonState(grid, nextGrid, gridWidth, gridHeight, cyclicNextStateFunc);
    grid.set(nextGrid);
  }

  plotter = makePixelToComplexPlotter(plotter);

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      plotter(x, y, colors[nextGrid[x + y * gridWidth]]);
    }
  }
};
