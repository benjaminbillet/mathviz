import { clampInt } from './misc';
import { makeGaussian2d } from './random';
import { Kernel, Optional } from './types';

export const Invert3x3Kernel = new Float32Array([
  0,  0,  0,
  0, -1,  0,
  0,  0,  0,
]);

export const Sharpen3x3Kernel = new Float32Array([
  0,  -1,  0,
  -1,  5, -1,
  0,  -1,  0,
]);

export const AvgBlur3x3Kernel = new Float32Array([
  1/9, 1/9, 1/9,
  1/9, 1/9, 1/9,
  1/9, 1/9, 1/9,
]);

export const HorizontalDerivative3x3Kernel = new Float32Array([
  0,  0, 0,
  -1, 1, 0,
  0,  0, 0,
]);

export const VerticalDerivative3x3Kernel = new Float32Array([
  0, -1, 0,
  0,  1, 0,
  0,  0, 0,
]);

export const EdgeDetect3x3Kernel = new Float32Array([
  0,  1, 0,
  1, -4, 1,
  0,  1, 0,
]);

export const SharpEdgeDetect3x3Kernel = new Float32Array([
  1,  2,  1,
  2, -12, 2,
  1,  2,  1,
]);

export const Outline3x3Kernel = new Float32Array([
  -1, -1, -1,
  -1,  8, -1,
  -1, -1, -1,
]);

export const Emboss3x3Kernel = new Float32Array([
  -2, -1, 0,
  -1,  1, 1,
  0,   1, 2,
]);

export const SobelVertical3x3Kernel = new Float32Array([
  -1, 0, 1,
  -2, 0, 2,
  -1, 0, 1,
]);

export const SobelHorizontal3x3Kernel = new Float32Array([
  -1, -2, -1,
  0,   0,  0,
  1,   2,  1,
]);

export const SobelVertical5x5Kernel = new Float32Array([
  -5,  -4,  0, 4,  5,
  -8,  -10, 0, 10, 8,
  -10, -20, 0, 10, 20,
  -8,  -10, 0, 10, 8,
  -5,  -4,  0, 4,  5,
]);

export const SobelHorizontal5x5Kernel = new Float32Array([
  -5, -8,  -10, -8,  -5,
  -4, -10, -20, -10, -4,
  0,   0,   0,   0,   0,
  4,   10,  20,  10,  4,
  5,   8,   10,  8,   5,
]);

// https://stackoverflow.com/questions/9567882/sobel-filter-kernel-of-large-size/41065243#41065243
export const makeSobelVerticalKernel = (size = 3) => {
  const kernel = new Float32Array(size * size);
  const halfSize = Math.trunc(size / 2);
  for (let i = -halfSize; i <= halfSize; i++) {
    for (let j = -halfSize; j <= halfSize; j++) {
      const x = i + halfSize;
      const y = j + halfSize;
      let v = 0;
      if (i !== 0 || j !== 0) {
        v = i / (i * i + j * j);
      }
      kernel[x + y * size] = v;
    }
  }
  return kernel;
};

export const makeSobelHorizontalKernel = (size = 3) => {
  const kernel = new Float32Array(size * size);
  const halfSize = Math.trunc(size / 2);
  for (let i = -halfSize; i <= halfSize; i++) {
    for (let j = -halfSize; j <= halfSize; j++) {
      const x = i + halfSize;
      const y = j + halfSize;
      let v = 0;
      if (i !== 0 || j !== 0) {
        v = j / (i * i + j * j);
      }
      kernel[x + y * size] = v;
    }
  }
  return kernel;
};

export const PrewittVertical3x3Kernel = new Float32Array([
  -1, 0, 1,
  -1, 0, 1,
  -1, 0, 1,
]);

export const PrewittHorizontal3x3Kernel = new Float32Array([
  -1, -1, -1,
  0,   0,  0,
  1,   1,  1,
]);

export const Lighten3x3Kernel = new Float32Array([
  0, 0,    0,
  0, 12/9, 0,
  0, 0,    0,
]);

export const Darken3x3Kernel = new Float32Array([
  0, 0,   0,
  0, 6/9, 0,
  0, 0,   0,
]);

/* export const makeEpanechnikovKernel = (size = 3) => {
  const kernel = new Array(size);
  const halfSize = Math.trunc(size / 2);
  const reverseSize = 1 / size;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const i2 = (i - halfSize) * reverseSize;
      const j2 = (j - halfSize) * reverseSize;
      // console.log(i2, j2, Math.sqrt(i2 * i2 + j2 * j2))
      kernel[i + j * size] = (1 - (i2 * i2 + j2 * j2)) * (3/4);
    }
    // console.log()
  }
  return kernel;
};*/

export const makeGaussianKernel = (size = 3, sigma?: Optional<number>) => {
  const kernel = new Float32Array(size * size);
  if (sigma == null) {
    sigma = size/3;
  }
  const gaussian = makeGaussian2d(sigma);

  const halfSize = Math.trunc(size / 2);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const x = (i - halfSize) / halfSize;
      const y = (j - halfSize) / halfSize;
      kernel[i + j * size] = gaussian(x, y);
    }
  }
  return kernel;
};

export const normalizeKernel = (kern: Kernel) => {
  const sum = kern.reduce((cur, x) => cur + x, 0);
  return kern.map(x => x / sum);
};

export const convolve = (input: Float32Array, output: Float32Array, width: number, height: number, kern: Kernel, divisor = 1, offset = 0) => {
  const kernSize = Math.trunc(Math.sqrt(kern.length));
  const kernHalfSize = Math.trunc(kernSize / 2);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;
      let r = 0;
      let g = 0;
      let b = 0;

      for (let kx = 0; kx < kernSize; kx++) {
        for (let ky = 0; ky < kernSize; ky++) {
          const x2 = clampInt(x + kx - kernHalfSize, 0, width - 1);
          const y2 = clampInt(y + ky - kernHalfSize, 0, height - 1);
          const idx2 = (x2 + y2 * width) * 4;
          const kidx = kx + (ky * kernSize);

          r += input[idx2 + 0] * kern[kidx];
          g += input[idx2 + 1] * kern[kidx];
          b += input[idx2 + 2] * kern[kidx];
        }
      }

      output[idx + 0] = r / divisor + offset;
      output[idx + 1] = g / divisor + offset;
      output[idx + 2] = b / divisor + offset;
      output[idx + 3] = 1 // TODO alpha
    }
  }
  return output;
};

/* export const densityAdaptiveConvolve = (input, output, width, height, maxKernelSize = 5, offset = 0) => {
  const filtersPerSize = {};
  let divisor = 1;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;
      let r = 0;
      let g = 0;
      let b = 0;

      let kernSize = Math.round(maxKernelSize / Math.pow(input[idx + 3] || 1, 0.5));
      if (kernSize % 2 === 0) {
        kernSize++;
      }
      // console.log('kernSize', kernSize);
      if (kernSize <= 1) {
        output[idx + 0] = input[idx + 0];
        output[idx + 1] = input[idx + 1];
        output[idx + 2] = input[idx + 2];
        output[idx + 3] = 255;
        continue;
      }
      divisor = 1/(kernSize * kernSize);
      const kernHalfSize = Math.trunc(kernSize / 2);

      let kern = filtersPerSize[kernSize];
      if (kern == null) {
        kern = makeEpanechnikovKernel(kernSize);
        filtersPerSize[kernSize] = kern;
      }

      for (let kx = 0; kx < kernSize; kx++) {
        for (let ky = 0; ky < kernSize; ky++) {
          const x2 = clamp(x + kx - kernHalfSize, 0, width - 1);
          const y2 = clamp(y + ky - kernHalfSize, 0, height - 1);
          const idx2 = (x2 + y2 * width) * 4;
          const kidx = kx  + (ky * kernSize);

          r += input[idx2 + 0] * kern[kidx];
          g += input[idx2 + 1] * kern[kidx];
          b += input[idx2 + 2] * kern[kidx];
        }
      }

      // console.log(r, g, b);
      output[idx + 0] = clamp(divisor * r + offset, 0, 255);
      output[idx + 1] = clamp(divisor * g + offset, 0, 255);
      output[idx + 2] = clamp(divisor * b + offset, 0, 255);
      output[idx + 3] = 255;
    }
  }
  return output;
};*/
