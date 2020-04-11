export const makeCyclicNextState = (maxState, range, threshold, neighborReduceFunc) => {
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
