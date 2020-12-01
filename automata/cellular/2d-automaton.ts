import { CellularAutomataGrid, CellularAutomataIterationPostProcessor, Color, Next2dCellStateFunction, Optional, PixelPlotter } from '../../utils/types';

export const getNext2dAutomatonState = (stateGrid: CellularAutomataGrid, nextGrid: CellularAutomataGrid, gridWidth: number, gridHeight: number, nextCellState: Next2dCellStateFunction) => {
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const idx = y * gridWidth + x;
      nextGrid[idx] = nextCellState(stateGrid, gridWidth, gridHeight, stateGrid[idx], x, y);
    }
  }
  return nextGrid;
};

export const iterate2dAutomaton = (gridWidth: number, gridHeight: number, nextCellState: Next2dCellStateFunction, iterations = 100, initialState?: Optional<CellularAutomataGrid>, postProcessIteration?: Optional<CellularAutomataIterationPostProcessor>) => {
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

    if (postProcessIteration != null) {
      postProcessIteration(grid, gridWidth, gridHeight);
    }
  }

  return grid;
};

export const plot2dAutomaton = (plotter: PixelPlotter, gridWidth: number, gridHeight: number, nextCellState: Next2dCellStateFunction, colors: Color[], deadCellState?: Optional<number>, iterations = 100, initialState?: Optional<CellularAutomataGrid>, postProcessIteration?: Optional<CellularAutomataIterationPostProcessor>) => {
  const grid = iterate2dAutomaton(gridWidth, gridHeight, nextCellState, iterations, initialState, postProcessIteration);

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const cellState = grid[x + y * gridWidth];
      if (cellState !== deadCellState) {
        plotter(x, y, colors[grid[x + y * gridWidth]], cellState);
      }
    }
  }

  return grid;
};
