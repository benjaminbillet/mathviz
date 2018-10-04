import { clamp, clampInt } from './misc';
import { makeGaussian2d } from './random';

export const Sharpen3x3Kernel = [
  0,  -1,  0,
  -1,  5, -1,
  0,  -1,  0,
];

export const AvgBlur3x3Kernel = [
  1/9, 1/9, 1/9,
  1/9, 1/9, 1/9,
  1/9, 1/9, 1/9,
];

export const EnhanceEdges3x3Kernel = [
  0,  0, 0,
  -1, 1, 0,
  0,  0, 0,
];

export const Outline3x3Kernel = [
  -1, -1, -1,
  -1,  8, -1,
  -1, -1, -1,
];

export const EdgeDetect3x3Kernel = [
  0,  1, 0,
  1, -4, 1,
  0,  1, 0,
];

export const Emboss3x3Kernel = [
  -2, -1, 0,
  -1,  1, 1,
  0,   1, 2,
];

export const SobelVertical3x3Kernel = [
  -1, 0, 1,
  -2, 0, 2,
  -1, 0, 1,
];

export const SobelHorizontal3x3Kernel = [
  -1, -2, -1,
  0,   0,  0,
  1,   2,  1,
];

export const Lighten3x3Kernel = [
  0, 0,    0,
  0, 12/9, 0,
  0, 0,    0,
];

export const Darken3x3Kernel = [
  0, 0,   0,
  0, 6/9, 0,
  0, 0,   0,
];

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

export const makeGaussianKernel = (size = 3, sigma = null) => {
  const kernel = new Array(size * size);
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

export const normalizeKernel = (kern) => {
  const sum = kern.reduce((cur, x) => cur + x, 0);
  return kern.map(x => x / sum);
};

export const convolve = (input, output, width, height, kern, divisor = 1, offset = 0) => {
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
          const x2 = clamp(x + kx - kernHalfSize, 0, width - 1);
          const y2 = clamp(y + ky - kernHalfSize, 0, height - 1);
          const idx2 = (x2 + y2 * width) * 4;
          const kidx = kx + (ky * kernSize);

          r += input[idx2 + 0] * kern[kidx];
          g += input[idx2 + 1] * kern[kidx];
          b += input[idx2 + 2] * kern[kidx];
        }
      }

      output[idx + 0] = clampInt(r / divisor + offset, 0, 255);
      output[idx + 1] = clampInt(g / divisor + offset, 0, 255);
      output[idx + 2] = clampInt(b / divisor + offset, 0, 255);
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
