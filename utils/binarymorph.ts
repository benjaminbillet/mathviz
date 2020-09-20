import { clampInt } from './misc';
import { euclidean } from './distance';
import { random } from './random';
import { BinaryMorphOperation, BiRealToRealFunction, PlotBuffer } from './types';

export const Cross3x3Element = [
  0, 1, 0,
  1, 1, 1,
  0, 1, 0,
];

export const Triangle3x3Element = [
  0, 0, 1,
  0, 1, 1,
  1, 1, 1,
];

export const TopTriangle3x3Element = [
  0, 1, 0,
  1, 1, 1,
  0, 0, 0,
];

export const BottomTriangle3x3Element = [
  0, 0, 0,
  1, 1, 1,
  0, 1, 0,
];

export const RightTriangle3x3Element = [
  0, 1, 0,
  0, 1, 1,
  0, 1, 0,
];

export const LeftTriangle3x3Element = [
  0, 1, 0,
  1, 1, 0,
  0, 1, 0,
];

export const Square3x3Element = [
  1, 1, 1,
  1, 1, 1,
  1, 1, 1,
];

export const T3x3Element = [
  1, 1, 1,
  0, 1, 0,
  0, 1, 0,
];

export const Circle7x7Element = [
  0, 0, 1, 1, 1, 0, 0,
  0, 1, 1, 1, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 1, 1, 1, 0,
  0, 0, 1, 1, 1, 0, 0,
];

export const Torus7x7Element = [
  0, 0, 1, 1, 1, 0, 0,
  0, 1, 1, 1, 1, 1, 0,
  1, 1, 1, 0, 1, 1, 1,
  1, 1, 0, 0, 0, 1, 1,
  1, 1, 1, 0, 1, 1, 1,
  0, 1, 1, 1, 1, 1, 0,
  0, 0, 1, 1, 1, 0, 0,
];

export const TopRightCorner3x3Element = [
  -1, 1, -1,
  0, 1, 1,
  0, 0, -1,
];

export const BottomLeftCorner3x3Element = [
  -1, 0, 0,
  1, 1, 0,
  -1, 1, -1,
];

export const TopLeftCorner3x3Element = [
  -1, 1, -1,
  1, 1, 0,
  -1, 0, 0,
];

export const BottomRightCorner3x3Element = [
  0, 0, -1,
  0, 1, 1,
  -1, 1, -1,
];


export const makeStructureElementSquare = (size: number) => {
  if (size % 2 === 0) {
    size++;
  }
  return new Uint8Array(size * size).fill(1);
};

export const makeStructureElementCross = (size: number) => {
  if (size % 2 === 0) {
    size++;
  }
  const element = new Uint8Array(size * size).fill(0);
  const center = Math.trunc(size / 2);
  for (let i = 0; i < size; i++) {
    element[center + i * size] = 1; // vertical line
    element[i + center * size] = 1; // horizontal line
  }
};

export const makeStructureElementCircle = (size: number) => {
  if (size % 2 === 0) {
    size++;
  }
  const halfSize = Math.trunc(size / 2);
  const element = new Uint8Array(size * size).fill(0);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (euclidean(i - halfSize, j - halfSize) / size <= 0.5) {
        element[i + j * size] = 1;
      }
    }
  }

  return element;
};

export const makeStructureElementEllipse = (size: number, ratioX = 1, ratioY = 0.5) => {
  if (size % 2 === 0) {
    size++;
  }
  const halfSize = Math.trunc(size / 2);
  const element = new Uint8Array(size * size).fill(0);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (euclidean((i - halfSize) / ratioX, (j - halfSize) / ratioY) / size <= 0.5) {
        element[i + j * size] = 1;
      }
    }
  }

  return element;
};

export const makeStructureElementEllipticCross = (size: number, ratioX = 0.5, ratioY = 0.5) => {
  if (size % 2 === 0) {
    size++;
  }
  const halfSize = Math.trunc(size / 2);
  const element = new Uint8Array(size * size).fill(0);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (euclidean((i - halfSize) / ratioX, (j - halfSize)) / size <= 0.5) {
        element[i + j * size] = 1;
      } else if (euclidean((i - halfSize), (j - halfSize) / ratioY) / size <= 0.5) {
        element[i + j * size] = 1;
      }
    }
  }

  return element;
};

export const makeStructureElementNoisyCircle = (size: number) => {
  if (size % 2 === 0) {
    size++;
  }
  const halfSize = Math.trunc(size / 2);
  const element = new Uint8Array(size * size).fill(0);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (euclidean(i - halfSize + Math.cos(random() * 2 * Math.PI), j - halfSize + Math.sin(random() * 2 * Math.PI)) / size <= 0.5) {
        element[i + j * size] = 1;
      }
    }
  }

  return element;
};


const morph = (output: PlotBuffer, width: number, height: number, operation: BinaryMorphOperation) => {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;
      const result = operation(x, y, idx);
      output[idx + 0] = result;
      output[idx + 1] = result;
      output[idx + 2] = result;
    }
  }
  return output;
};

export const complement = (input: PlotBuffer, output: PlotBuffer, width: number, height: number) => {
  return morph(output, width, height, (x, y, idx) => 1 - input[idx]);
};

export const union = (input1: PlotBuffer, input2: PlotBuffer, output: PlotBuffer, width: number, height: number) => {
  return morph(output, width, height, (x, y, idx) => input1[idx] || input2[idx]);
};

export const intersection  = (input1: PlotBuffer, input2: PlotBuffer, output: PlotBuffer, width: number, height: number) => {
  return morph(output, width, height, (x, y, idx) => input1[idx] && input2[idx]);
};

export const substract  = (input1: PlotBuffer, input2: PlotBuffer, output: PlotBuffer, width: number, height: number) => {
  return morph(output, width, height, (x, y, idx) => input1[idx] && (1 - input2[idx]));
};

const erodeOperation = (input: PlotBuffer, width: number, height: number, x: number, y: number, element: PlotBuffer, elementSize: number) => {
  for (let ex = 0; ex < elementSize; ex++) {
    for (let ey = 0; ey < elementSize; ey++) {
      const x2 = clampInt(x + ex, 0, width - 1);
      const y2 = clampInt(y + ey, 0, height - 1);
      const idx2 = (x2 + y2 * width) * 4;
      const eidx = ex + (ey * elementSize);
      if (element[eidx] !== -1) { // -1 = transparent
        if (element[eidx] !== input[idx2]) {
          return 0;
        }
      }
    }
  }
  return 1;
};
export const erode = (input: PlotBuffer, output: PlotBuffer, width: number, height: number, element = Square3x3Element) => {
  const elementSize = Math.trunc(Math.sqrt(element.length));
  const elementHalfSize = Math.trunc(elementSize / 2);
  const parameterizedErosion: BinaryMorphOperation = (x, y) => erodeOperation(input, width, height, x - elementHalfSize, y - elementHalfSize, element, elementSize);
  return morph(output, width, height, parameterizedErosion);
};

export const dilate = (input: PlotBuffer, output: PlotBuffer, width: number, height: number, element = Square3x3Element) => {
  const elementSize = Math.trunc(Math.sqrt(element.length));
  const elementHalfSize = Math.trunc(elementSize / 2);
  return morph(output, width, height, (x, y) => {
    for (let ex = 0; ex < elementSize; ex++) {
      for (let ey = 0; ey < elementSize; ey++) {
        const x2 = clampInt(x - elementHalfSize + ex, 0, width - 1);
        const y2 = clampInt(y - elementHalfSize + ey, 0, height - 1);
        const idx2 = (x2 + y2 * width) * 4;
        const eidx = ex + (ey * elementSize);

        if (element[eidx] !== -1) { // -1 = transparent
          if (element[eidx] === 1 && input[idx2] === 1) {
            return 1;
          }
        }
      }
    }
    return 0;
  });
};

export const opening = (input: PlotBuffer, output: PlotBuffer, width: number, height: number, element = Square3x3Element) => {
  const dilated = erode(input, new Uint8Array(input.length), width, height, element);
  return dilate(dilated, output, width, height, element);
};

export const closing = (input: PlotBuffer, output: PlotBuffer, width: number, height: number, element = Square3x3Element) => {
  const eroded = dilate(input, new Uint8Array(input.length), width, height, element);
  return erode(eroded, output, width, height, element);
};

export const boundary = (input: PlotBuffer, output: PlotBuffer, width: number, height: number, element = Square3x3Element) => {
  const eroded = erode(input, new Uint8Array(input.length), width, height, element);
  return substract(input, eroded, output, width, height);
};

export const iterativeThinning = (input: PlotBuffer, output: PlotBuffer, width: number, height: number, iterations = 5) => {
  const elementSize = 3;
  const elementHalfSize = 1;

  const current = new Uint8Array(input);
  const next = new Uint8Array(input.length);

  const erosion1: BiRealToRealFunction = (x, y) => erodeOperation(current, width, height, x - elementHalfSize, y - elementHalfSize, TopLeftCorner3x3Element, elementSize);
  const erosion2: BiRealToRealFunction = (x, y) => erodeOperation(current, width, height, x - elementHalfSize, y - elementHalfSize, TopRightCorner3x3Element, elementSize);
  const erosion3: BiRealToRealFunction = (x, y) => erodeOperation(current, width, height, x - elementHalfSize, y - elementHalfSize, BottomLeftCorner3x3Element, elementSize);
  const erosion4: BiRealToRealFunction = (x, y) => erodeOperation(current, width, height, x - elementHalfSize, y - elementHalfSize, BottomRightCorner3x3Element, elementSize);

  for (let i = 0; i < iterations; i++) {
    morph(next, width, height, (x, y) => {
      return erosion1(x, y) || erosion2(x, y) || erosion3(x, y) || erosion4(x, y);
    });
    substract(current, next, output, width, height);
    current.set(output);
  }

  return output;
};

