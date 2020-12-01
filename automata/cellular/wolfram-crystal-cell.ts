import { reduceVonNeumannHexagonalNeighbor } from './neighborhood';
import { random } from '../../utils/random';
import { Next2dCellStateFunction } from '../../utils/types';

// https://www.wolframscience.com/nks/p371--the-growth-of-crystals
export const makeWolframCrystalNextState = (hexagonalNeighborReduceFunc = reduceVonNeumannHexagonalNeighbor): Next2dCellStateFunction => {
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

export const makeProbabilisticWolframCrystalNextState = (
  birthProbabilities = [ 0, 1, 0, 0, 0, 0, 0 ], // add 1 more item if includeItself is true
  deathProbability = [ 0, 0, 0, 0, 0, 0, 0 ],  // add 1 more item if includeItself is true
  includeItself = false, // if true, the center cell state is included in the neighborood sum
  hexagonalNeighborReduceFunc = reduceVonNeumannHexagonalNeighbor
): Next2dCellStateFunction => {
  return (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
    const sum = hexagonalNeighborReduceFunc(stateGrid, gridWidth, gridHeight, x, y, 1, (total, neighborState) => {
      if (neighborState === 1) {
        return total + 1;
      }
      return total;
    }, includeItself ? currentState : 0);

    if (currentState === 0) { // dead cell
      const probability = birthProbabilities[sum] || 0;
      if (probability === 0) {
        return 0;
      } else if (probability === 1) {
        return 1;
      } else if (random() < probability) {
        return 1;
      }
      return 0;
    } else if (currentState === 1) { // alive cell
      const probability = deathProbability[sum] || 0;
      if (probability === 0) {
        return 1;
      } else if (probability === 1) {
        return 0;
      } else if (random() < probability) {
        return 0;
      }
      return 1;
    } else {
      throw new Error('Cells can have only [0, 1] states');
    }
  };
};

