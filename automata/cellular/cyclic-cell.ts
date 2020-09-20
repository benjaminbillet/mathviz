import { NeighborReducer, NextCellStateFunction } from "../../utils/types";

export const makeCyclicNextState = (maxState: number, range: number, threshold: number, neighborReduceFunc: NeighborReducer): NextCellStateFunction => {
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
