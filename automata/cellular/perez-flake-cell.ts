import { CellularAutomataGrid, NextCellStateFunction } from '../../utils/types';
import { reduceVonNeumannHexagonalNeighbor, reduceMooreHexagonalNeighbor } from './neighborhood';

// http://psoup.math.wisc.edu/extras/hexca/hexca.html
// http://psoup.math.wisc.edu/extras/hexca/flake1.gif
export const perezSnowflakeNextState = (stateGrid: CellularAutomataGrid, gridWidth: number, gridHeight: number, currentState: number, x: number, y: number) => {
  const sum = reduceVonNeumannHexagonalNeighbor(stateGrid, gridWidth, gridHeight, x, y, 1, (total, neighborState) => {
    if (neighborState === 1) {
      return total + 1;
    }
    return total;
  }, currentState);
  if (sum === 1 || sum === 2) {
    return 1;
  }
  return 0;
};

export const makePerezSnowflakeNextState = (aliveSums = [ 0, 1, 1, 0, 0, 0, 0, 0 ], hexagonalNeighborReduceFunc = reduceVonNeumannHexagonalNeighbor): NextCellStateFunction => {
  return (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
    const sum = hexagonalNeighborReduceFunc(stateGrid, gridWidth, gridHeight, x, y, 1, (total, neighborState) => {
      if (neighborState === 1) {
        return total + 1;
      }
      return total;
    }, currentState);
    if (aliveSums[sum] === 1) {
      return 1;
    }
    return 0;
  };
};

// a cyclic version of the above automaton
export const makePerezCyclicSnowflakeNextState = (
  maxState: number,
  aliveSums = [ 0, 1, 0, 1, 0, 0, 1 ], // add 1 more item if includeItself is true
  includeItself = false,
  hexagonalNeighborReduceFunc = reduceVonNeumannHexagonalNeighbor
): NextCellStateFunction => {
  return (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
    const sum = hexagonalNeighborReduceFunc(stateGrid, gridWidth, gridHeight, x, y, 1, (total, neighborState) => {
      if (neighborState > 0) {
        return total + 1;
      }
      return total;
    }, includeItself && currentState > 0 ? 1 : 0);
    if (aliveSums[sum] === 1) {
      return (currentState + 1) % maxState;
    }
    return 0;
  };
};

export const makePerezCyclicSnowflakeNextState2 = (
  maxState: number,
  aliveSums = [ 0, 1, 0, 1, 0, 0, 1 ], // add 1 more item if includeItself is true
  includeItself = false,
  hexagonalNeighborReduceFunc = reduceVonNeumannHexagonalNeighbor,
  range = 1,
): NextCellStateFunction => {
  return (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
    if (currentState > 0) {
      return (currentState + 1) % maxState;
    }
    const sum = hexagonalNeighborReduceFunc(stateGrid, gridWidth, gridHeight, x, y, range, (total, neighborState) => {
      if (neighborState > 0) {
        return total + 1;
      }
      return total;
    }, includeItself && currentState > 0 ? 1 : 0);
    if (aliveSums[sum] === 1) {
      return 1;
    }
    return 0;
  };
};
