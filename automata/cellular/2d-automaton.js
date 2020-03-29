
export const getNextAutomatonState = (stateGrid, nextGrid, gridWidth, gridHeight, nextCellState) => {
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const idx = y * gridWidth + x;
      nextGrid[idx] = nextCellState(stateGrid, gridWidth, gridHeight, stateGrid[idx], x, y);
    }
  }
  return nextGrid;
};


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
