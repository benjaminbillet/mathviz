// import math from '../../utils/math';
import { complex } from '../../utils/complex';


export const forEachMooreNeighbor = (grid, width, height, centerX, centerY, range, func) => {
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

export const reduceMooreNeighbor = (grid, width, height, centerX, centerY, range, func, initialValue) => {
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

export const forEachVonNeumannNeighbor = (grid, width, height, centerX, centerY, range, func) => {
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

export const reduceVonNeumannNeighbor = (grid, width, height, centerX, centerY, range, func, initialValue) => {
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

export const forEachVonNeumannHexagonalNeighbor = (grid, width, height, centerX, centerY, range, func) => {
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if (Math.abs(i + j) <= range) {
        const x = i + centerX;
        const y = j + centerY;
        func(grid[x + y * width], x, y, grid);
      }
    }
  }
};

export const reduceVonNeumannHexagonalNeighbor = (grid, width, height, centerX, centerY, range, func, initialValue) => {
  let result = initialValue;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if (Math.abs(i + j) <= range) {
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
export const forEachMooreHexagonalNeighbor = (grid, width, height, centerX, centerY, range, func) => {
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

export const reduceMooreHexagonalNeighbor = (grid, width, height, centerX, centerY, range, func, initialValue) => {
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

export const forEachStarHexagonalNeighbor = (grid, width, height, centerX, centerY, range, func) => {
  return HEX_DIRECTIONS.forEach((direction) => {
    const x = centerX + direction.re * range;
    const y = centerY + direction.im * range;
    if (x >= 0 && x < width && y >= 0 && y < height) {
      func(grid[x + y * width], x, y, grid);
    }
  });
};

export const reduceStarHexagonalNeighbor = (grid, width, height, centerX, centerY, range, func, initialValue) => {
  let result = initialValue;
  HEX_DIRECTIONS.forEach((direction) => {
    const x = centerX + direction.re * range;
    const y = centerY + direction.im * range;
    if (x >= 0 && x < width && y >= 0 && y < height) {
      result = func(result, grid[x + y * width], x, y, grid);
    }
  });
  return result;
};


export const forEachCircularNeighbor = (grid, width, height, centerX, centerY, range, func) => {
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

export const reduceCircularNeighbor = (grid, width, height, centerX, centerY, range, func, initialValue) => {
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

export const HexagonalNeighborhoodReducer = {
  Moore: reduceMooreHexagonalNeighbor,
  VonNeumann: reduceVonNeumannHexagonalNeighbor,
  Star: reduceStarHexagonalNeighbor,
};

export const HexagonalNeighborhoodIterator = {
  Moore: forEachMooreHexagonalNeighbor,
  VonNeumann: forEachVonNeumannHexagonalNeighbor,
  Star: forEachStarHexagonalNeighbor,
};

