import { makePixelToComplexPlotter } from '../../utils/plotter';

export const getNext2dAutomatonState = (stateGrid, nextGrid, gridWidth, gridHeight, nextCellState) => {
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const idx = y * gridWidth + x;
      nextGrid[idx] = nextCellState(stateGrid, gridWidth, gridHeight, stateGrid[idx], x, y);
    }
  }
  return nextGrid;
};

export const iterate2dAutomaton = (gridWidth, gridHeight, nextCellState, iterations = 100, initialState = null) => {
  // create a grid of cells, based on the initial state if provided
  const grid = new Uint8Array(gridWidth * gridHeight).fill(0);
  if (initialState != null) {
    if (initialState.length !== grid.length) {
      throw new Error('invalid initial state');
    }
    grid.set(initialState);
  }

  const nextGrid = new Uint8Array(grid.length).fill(0);

  for (let i = 0; i < iterations; i++) {
    getNext2dAutomatonState(grid, nextGrid, gridWidth, gridHeight, nextCellState);
    grid.set(nextGrid);
  }

  return grid;
};

export const plot2dAutomaton = (plotter, gridWidth, gridHeight, nextCellState, colors, deadCellState = null, iterations = 100, initialState = null) => {
  const grid = iterate2dAutomaton(gridWidth, gridHeight, nextCellState, iterations, initialState);

  plotter = makePixelToComplexPlotter(plotter);

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const cellState = grid[x + y * gridWidth];
      if (cellState !== deadCellState) {
        plotter(x, y, colors[grid[x + y * gridWidth]]);
      }
    }
  }

  return grid;
};
