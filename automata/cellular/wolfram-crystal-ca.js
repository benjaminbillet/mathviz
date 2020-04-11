import { reduceVonNeumannHexagonalNeighbor } from './neighborhood';

// https://www.wolframscience.com/nks/p371--the-growth-of-crystals
export const makeWolframCrystalNextState = (hexagonalNeighborReduceFunc = reduceVonNeumannHexagonalNeighbor) => {
  return (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
    if (currentState !== 0) {
      return currentState;
    }
    const sum = hexagonalNeighborReduceFunc(stateGrid, gridWidth, gridHeight, x, y, 1, (total, neighborState) => {
      if (neighborState === 1) {
        return total + 1;
      }
      return total;
    }, 0);
    if (sum === 1) {
      return 1;
    }
    return 0;
  };
};
