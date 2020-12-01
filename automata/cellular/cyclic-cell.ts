import { NeighborReducer, Next1dCellStateFunction, Next2dCellStateFunction } from '../../utils/types';

export const makeCyclicNextState2d = (maxState: number, range: number, threshold: number, neighborReduceFunc: NeighborReducer): Next2dCellStateFunction => {
  return (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
    const nextState = (currentState + 1) % maxState;
    const sum = neighborReduceFunc(stateGrid, gridWidth, gridHeight, x, y, range, (total, neighborState) => {
      if (neighborState === nextState) {
        return total + 1;
      }
      return total;
    }, 0);
    if (sum >= threshold) {
      return nextState;
    }
    return currentState;
  };
};

export const makeCyclicNextState1d = (maxState: number, range: number, threshold: number): Next1dCellStateFunction => {
  return (stateLine, lineWidth, currentState, x) => {
    const nextState = (currentState + 1) % maxState;
    let sum = 0;
    for (let i = -range; i <= range; i++) {
      const idx = x + i;
      if (idx >= 0 && idx < lineWidth && stateLine[idx] === nextState) {
        sum++;
      }
    }
    if (sum >= threshold) {
      return nextState;
    }
    return currentState;
  };
};
