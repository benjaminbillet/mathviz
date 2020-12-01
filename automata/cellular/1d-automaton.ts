import { CellularAutomataGrid, CellularAutomataIterationPostProcessor, CellularAutomataLine, Color, Next1dCellStateFunction, Optional, PixelPlotter } from '../../utils/types';

export const getNext1dAutomatonState = (stateLine: CellularAutomataLine, nextLine: CellularAutomataLine, lineWidth: number, nextCellState: Next1dCellStateFunction) => {
  for (let x = 0; x < lineWidth; x++) {
    nextLine[x] = nextCellState(stateLine, lineWidth, stateLine[x], x);
  }
  return nextLine;
};

export const iterate1dAutomaton = (gridWidth: number, gridHeight: number, nextCellState: Next1dCellStateFunction, iterations = 100, initialState?: Optional<CellularAutomataGrid>, startAtLine = 0, postProcessIteration?: Optional<CellularAutomataIterationPostProcessor>) => {
  // create a grid of cells, based on the initial state if provided
  const grid = new Uint8Array(gridWidth * gridHeight).fill(0);
  if (initialState != null) {
    if (initialState.length !== grid.length) {
      throw new Error('invalid initial state');
    }
    grid.set(initialState);
  }

  const lineInput = new Uint8Array(gridWidth).fill(0);
  const lineOutput = new Uint8Array(gridWidth).fill(0);

  for (let i = startAtLine; i < startAtLine + iterations; i++) {
    // copy the current line from the grid to the line buffer
    for (let j = 0; j < gridWidth; j++) {
      lineInput[j] = grid[i * gridWidth + j];
    }

    getNext1dAutomatonState(lineInput, lineOutput, gridWidth, nextCellState);

    // copy the new state into the next line
    for (let j = 0; j < gridWidth; j++) {
      grid[(i + 1) * gridWidth + j] = lineOutput[j];
    }

    if (postProcessIteration != null) {
      postProcessIteration(grid, gridWidth, gridHeight);
    }
  }

  return grid;
};

export const plot1dAutomaton = (plotter: PixelPlotter, gridWidth: number, gridHeight: number, nextCellState: Next1dCellStateFunction, colors: Color[], deadCellState?: Optional<number>, iterations = 100, initialState?: Optional<CellularAutomataGrid>, startAtLine = 0, postProcessIteration?: Optional<CellularAutomataIterationPostProcessor>) => {
  if (startAtLine + iterations >= gridHeight) {
    throw new Error('Grid overflow');
  }
  
  const grid = iterate1dAutomaton(gridWidth, gridHeight, nextCellState, iterations, initialState, startAtLine, postProcessIteration);

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
