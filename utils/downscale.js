import { clamp, clampInt } from './misc';
import { normalizeKernel } from './convolution';
import { makeLanczos, makeMitchellNetravali, makeCubicBSpline, makeCatmullRom, makeMitchellNetravali2 } from './interpolation';

const makeKernel = (size, separableFilter, normalizationFactor) => {
  const halfSize = Math.trunc(size / 2);
  const kernel = new Array(size * size);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const x = (i - halfSize) * normalizationFactor;
      const y = (j - halfSize) * normalizationFactor;
      kernel[i + j * size] = separableFilter(x) * separableFilter(y);
    }
  }
  return normalizeKernel(kernel);
};

const SAMPLERS = {
  Lanczos2: (normalizationFactor = 1) => makeKernel(4, makeLanczos(2), normalizationFactor),
  Lanczos3: (normalizationFactor = 1) => makeKernel(6, makeLanczos(3), normalizationFactor),
  Lanczos6: (normalizationFactor = 1) => makeKernel(12, makeLanczos(6), normalizationFactor),
  Lanczos12: (normalizationFactor = 1) => makeKernel(24, makeLanczos(12), normalizationFactor),
  MitchellNetravali: (normalizationFactor = 1) => makeKernel(4, makeMitchellNetravali(), normalizationFactor),
  MitchellNetravali2: (normalizationFactor = 1) => makeKernel(4, makeMitchellNetravali2(), normalizationFactor),
  CatmullRom: (normalizationFactor = 1) => makeKernel(4, makeCatmullRom(), normalizationFactor),
  CubicBSpline: (normalizationFactor = 1) => makeKernel(4, makeCubicBSpline(), normalizationFactor),
  NearestNeighbor: () => [ 1 ],
};
const SAMPLER_KERN_SIZE = {
  Lanczos2: 4,
  Lanczos3: 6,
  Lanczos6: 12,
  Lanczos12: 24,
  MitchellNetravali: 4,
  MitchellNetravali2: 4,
  CatmullRom: 4,
  CubicBSpline: 4,
  NearestNeighbor: 1,
};
export const SUPPORTED_SAMPLERS = Object.keys(SAMPLERS);


export const downscale = (input, width, height, scale, sampler = 'Lanczos3') => {
  if (scale >= 1) {
    return input;
  }

  const kernelBuilder = SAMPLERS[sampler];
  const kernSize = SAMPLER_KERN_SIZE[sampler];
  const kernHalfSize = Math.trunc(kernSize / 2);
  const kern = kernelBuilder(scale);

  const outputWidth = Math.trunc(scale * width);
  const outputHeight = Math.trunc(scale * height);
  const output = new Float64Array(outputWidth * outputHeight * 4);

  for (let x = 0; x < outputWidth; x++) {
    for (let y = 0; y < outputHeight; y++) {
      const ix = Math.trunc(x / scale); // input domain
      const iy = Math.trunc(y / scale); // input domain

      const idx = (x + y * outputWidth) * 4;
      let r = 0;
      let g = 0;
      let b = 0;

      for (let kx = 0; kx < kernSize; kx++) {
        for (let ky = 0; ky < kernSize; ky++) {
          const x2 = clamp(ix + kx - kernHalfSize, 0, width - 1);
          const y2 = clamp(iy + ky - kernHalfSize, 0, height - 1);
          const idx2 = (x2 + y2 * width) * 4;

          const kidx = kx + (ky * kernSize);
          r += input[idx2 + 0] * kern[kidx];
          g += input[idx2 + 1] * kern[kidx];
          b += input[idx2 + 2] * kern[kidx];
        }
      }
      // const [ r, g, b ] = getInterpolated(x, y, width, input);

      output[idx + 0] = clampInt(r, 0, 255);
      output[idx + 1] = clampInt(g, 0, 255);
      output[idx + 2] = clampInt(b, 0, 255);
      output[idx + 3] = 255;
    }
  }

  return output;
};
