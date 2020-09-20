import { clampInt } from './misc';
import { normalizeKernel } from './convolution';
import { makeLanczos, makeMitchellNetravali, makeCubicBSpline, makeCatmullRom, makeMitchellNetravali2 } from './interpolation';
import { PlotBuffer, RealToRealFunction } from './types';

const makeKernel = (size: number, separableFilter: RealToRealFunction, scaleX = 1, scaleY = 1) => {
  const halfSize = Math.trunc(size / 2);
  const kernel = new Float32Array(size * size);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const x = (i - halfSize) * scaleX;
      const y = (j - halfSize) * scaleY;
      kernel[i + j * size] = separableFilter(x) * separableFilter(y);
    }
  }
  return normalizeKernel(kernel);
};

export const DownscaleSamplers = {
  Lanczos2: (scaleX = 1, scaleY = 1) => makeKernel(4, makeLanczos(2), scaleX, scaleY),
  Lanczos3: (scaleX = 1, scaleY = 1) => makeKernel(6, makeLanczos(3), scaleX, scaleY),
  Lanczos6: (scaleX = 1, scaleY = 1) => makeKernel(12, makeLanczos(6), scaleX, scaleY),
  Lanczos12: (scaleX = 1, scaleY = 1) => makeKernel(24, makeLanczos(12), scaleX, scaleY),
  MitchellNetravali: (scaleX = 1, scaleY = 1) => makeKernel(4, makeMitchellNetravali(), scaleX, scaleY),
  MitchellNetravali2: (scaleX = 1, scaleY = 1) => makeKernel(4, makeMitchellNetravali2(), scaleX, scaleY),
  CatmullRom: (scaleX = 1, scaleY = 1) => makeKernel(4, makeCatmullRom(), scaleX, scaleY),
  CubicBSpline: (scaleX = 1, scaleY = 1) => makeKernel(4, makeCubicBSpline(), scaleX, scaleY),
  NearestNeighbor: () => [ 1 ],
};

export const downscale = (input: PlotBuffer, width: number, height: number, scale: number, kernelSampler = DownscaleSamplers.Lanczos3) => {
  const outputWidth = Math.trunc(scale * width);
  const outputHeight = Math.trunc(scale * height);
  return downscale2(input, width, height, outputWidth, outputHeight, kernelSampler);
};

export const downscale2 = (input: PlotBuffer, width: number, height: number, outputWidth: number, outputHeight: number, kernelSampler = DownscaleSamplers.Lanczos3): PlotBuffer => {
  const scaleX = outputWidth / width;
  const scaleY = outputHeight / height;

  const kern = kernelSampler(scaleX, scaleY);
  const kernSize = Math.trunc(Math.sqrt(kern.length));
  const kernHalfSize = Math.trunc(kernSize / 2);

  const output = new Float32Array(outputWidth * outputHeight * 4);

  for (let x = 0; x < outputWidth; x++) {
    for (let y = 0; y < outputHeight; y++) {
      const ix = Math.trunc(x / scaleX); // input domain
      const iy = Math.trunc(y / scaleY); // input domain

      const idx = (x + y * outputWidth) * 4;
      let r = 0;
      let g = 0;
      let b = 0;

      for (let kx = 0; kx < kernSize; kx++) {
        for (let ky = 0; ky < kernSize; ky++) {
          const x2 = clampInt(ix + kx - kernHalfSize, 0, width - 1);
          const y2 = clampInt(iy + ky - kernHalfSize, 0, height - 1);
          const idx2 = (x2 + y2 * width) * 4;

          const kidx = kx + (ky * kernSize);
          r += input[idx2 + 0] * kern[kidx];
          g += input[idx2 + 1] * kern[kidx];
          b += input[idx2 + 2] * kern[kidx];
        }
      }
      output[idx + 0] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
    }
  }

  return output;
};
