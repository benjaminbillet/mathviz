// import math from '../../utils/math';
import { complex } from '../../utils/complex';
import { CellularAutomataGrid, Index, NeighborForEachFunction, NeighborIterator, NeighborReduceFunction, NeighborReducer } from '../../utils/types';


export const forEachMooreNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborForEachFunction) => {
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if (i !== 0 || j !== 0) {
        // const x = math.mod(i + centerX, width);
        // const y = math.mod(j + centerY, height);
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          func(grid[x + y * width], x, y, grid);
        }
      }
    }
  }
};

export const reduceMooreNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborReduceFunction, initialValue: number) => {
  let result = initialValue;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if (i !== 0 || j !== 0) {
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          result = func(result, grid[x + y * width], x, y, grid);
        }
      }
    }
  }
  return result;
};

export const forEachVonNeumannNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborForEachFunction) => {
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if ((i !== 0 || j !== 0) && Math.abs(i) + Math.abs(j) <= range) {
        // const x = math.mod(i + centerX, width);
        // const y = math.mod(j + centerY, height);
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          func(grid[x + y * width], x, y, grid);
        }
      }
    }
  }
};

export const reduceVonNeumannNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborReduceFunction, initialValue: number) => {
  let result = initialValue;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if ((i !== 0 || j !== 0) && Math.abs(i) + Math.abs(j) <= range) {
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          result = func(result, grid[x + y * width], x, y, grid);
        }
      }
    }
  }
  return result;
};

export const forEachVonNeumannHexagonalNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborForEachFunction) => {
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if ((i !== 0 || j !== 0) && Math.abs(i + j) <= range) {
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          func(grid[x + y * width], x, y, grid);
        }
      }
    }
  }
};

export const reduceVonNeumannHexagonalNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborReduceFunction, initialValue: number) => {
  let result = initialValue;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if ((i !== 0 || j !== 0) && Math.abs(i + j) <= range) {
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          result = func(result, grid[x + y * width], x, y, grid);
        }
      }
    }
  }
  return result;
};

const HEX_DIRECTIONS = [
  complex(-1, 1),
  complex(0, 1),
  complex(1, 0),
  complex(1, -1),
  complex(0, -1),
  complex(-1, 0),
];
export const forEachMooreHexagonalNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborForEachFunction) => {
  const rangePlusOne = range + 1;
  for (let i = -rangePlusOne; i <= rangePlusOne; i++) {
    for (let j = -rangePlusOne; j <= rangePlusOne; j++) {
      if (Math.abs(i + j) <= rangePlusOne && !HEX_DIRECTIONS.some(d => i === d.re * rangePlusOne && j === d.im * rangePlusOne)) {
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          func(grid[x + y * width], x, y, grid);
        }
      }
    }
  }
};

export const reduceMooreHexagonalNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborReduceFunction, initialValue: number) => {
  let result = initialValue;
  const rangePlusOne = range + 1;
  for (let i = -rangePlusOne; i <= rangePlusOne; i++) {
    for (let j = -rangePlusOne; j <= rangePlusOne; j++) {
      if (Math.abs(i + j) <= rangePlusOne && !HEX_DIRECTIONS.some(d => i === d.re * rangePlusOne && j === d.im * rangePlusOne)) {
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          result = func(result, grid[x + y * width], x, y, grid);
        }
      }
    }
  }
  return result;
};

export const forEachStarHexagonalNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, filled: boolean, func: NeighborForEachFunction) => {
  let minRange = range;
  if (filled) {
    minRange = 1;
  }
  for (let i = minRange; i <= range; i++) {
    HEX_DIRECTIONS.forEach((direction) => {
      const x = centerX + direction.re * i;
      const y = centerY + direction.im * i;
      if (x >= 0 && x < width && y >= 0 && y < height) {
        func(grid[x + y * width], x, y, grid);
      }
    });
  }
};

export const reduceStarHexagonalNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, filled: boolean, func: NeighborReduceFunction, initialValue: number) => {
  let minRange = range;
  if (filled) {
    minRange = 1;
  }
  let result = initialValue;
  for (let i = minRange; i <= range; i++) {
    HEX_DIRECTIONS.forEach((direction) => {
      const x = centerX + direction.re * i;
      const y = centerY + direction.im * i;
      if (x >= 0 && x < width && y >= 0 && y < height) {
        result = func(result, grid[x + y * width], x, y, grid);
      }
    });
  }
  return result;
};


export const forEachCircularNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborForEachFunction) => {
  const rangeSquared = range * range;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if (i * i + j * j <= rangeSquared) {
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          func(grid[x + y * width], x, y, grid);
        }
      }
    }
  }
};

export const reduceCircularNeighbor = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborReduceFunction, initialValue: number) => {
  let result = initialValue;
  const rangeSquared = range * range;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if (i * i + j * j <= rangeSquared) {
        const x = i + centerX;
        const y = j + centerY;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          result = func(result, grid[x + y * width], x, y, grid);
        }
      }
    }
  }
  return result;
};

export const NeighborhoodReducer = {
  Moore: reduceMooreNeighbor,
  VonNeumann: reduceVonNeumannNeighbor,
  Circular: reduceCircularNeighbor,
};

export const NeighborhoodIterator = {
  Moore: forEachMooreNeighbor,
  VonNeumann: forEachVonNeumannNeighbor,
  Circular: forEachCircularNeighbor,
};

export const HexagonalNeighborhoodReducer: Index<NeighborReducer> = {
  Moore: reduceMooreHexagonalNeighbor,
  VonNeumann: reduceVonNeumannHexagonalNeighbor,
  FullStar: (grid, width, height, centerX, centerY, range, func, initialValue) => reduceStarHexagonalNeighbor(grid, width, height, centerX, centerY, range, true, func, initialValue),
  SparseStar: (grid, width, height, centerX, centerY, range, func, initialValue) => reduceStarHexagonalNeighbor(grid, width, height, centerX, centerY, range, false, func, initialValue),
};

export const HexagonalNeighborhoodIterator: Index<NeighborIterator> = {
  Moore: forEachMooreHexagonalNeighbor,
  VonNeumann: forEachVonNeumannHexagonalNeighbor,
  FullStar: (grid, width, height, centerX, centerY, range, func) => forEachStarHexagonalNeighbor(grid, width, height, centerX, centerY, range, true, func),
  SparseStar: (grid, width, height, centerX, centerY, range, func) => forEachStarHexagonalNeighbor(grid, width, height, centerX, centerY, range, false, func),
};

