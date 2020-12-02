import { ReactDiffuseFunction, ReactionDiffusionGrid } from '../../utils/types';

// Gray-scott model for reaction diffusion
// http://www.karlsims.com/rd.html

export const getNextReactionDiffusionState = <S> (stateGrid: ReactionDiffusionGrid<S>, nextGrid: ReactionDiffusionGrid<S>, gridWidth: number, gridHeight: number, nextState: ReactDiffuseFunction<S>) => {
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const idx = y * gridWidth + x;
      nextGrid[idx] = nextState(stateGrid, gridWidth, gridHeight, stateGrid[idx], x, y);
    }
  }
  return nextGrid;
};


export const reactDiffuse = <S> (gridWidth: number, gridHeight: number, nextState: ReactDiffuseFunction<S>, iterations = 100, getInitialState: (x: number, y: number) => S) => {
  // create a grid of cells, based on the initial state if provided
  let grid: S[] = new Array(gridWidth * gridHeight);
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const idx = y * gridWidth + x;
      grid[idx] = getInitialState(x, y);
    }
  }

  let nextGrid: S[] = [];

  for (let i = 0; i < iterations; i++) {
    nextGrid = new Array(gridWidth * gridHeight).fill(null);
    getNextReactionDiffusionState(grid, nextGrid, gridWidth, gridHeight, nextState);
    grid = nextGrid;
  }

  return nextGrid;
};

export const plotReactionDiffusion2D = <S> (renderState: (x: number, y: number, state: S) => void, gridWidth: number, gridHeight: number, nextState: ReactDiffuseFunction<S>, getInitialState: (x: number, y: number) => S, iterations = 100) => {
  const grid = reactDiffuse(gridWidth, gridHeight, nextState, iterations, getInitialState);

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const state = grid[x + y * gridWidth];
      renderState(x, y, state);
    }
  }

  return grid;
};
