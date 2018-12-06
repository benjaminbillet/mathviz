import { clamp, clampInt } from './misc';
import { getLuminance } from './color';
import { makeGaussian } from './random';
import { makeGaussianKernel } from './convolution';

export const bilateralFilter = (input, output, width, height, kernSize, sigma1, sigma2) => {
  const kern = makeGaussianKernel(kernSize, sigma1);
  const lumGaussian = makeGaussian(sigma2);
  const kernHalfSize = Math.trunc(kernSize / 2);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;
      const luminance = getLuminance(input[idx], input[idx + 1], input[idx + 2]);
      let r = 0;
      let g = 0;
      let b = 0;

      let weightSum = 0;
      for (let kx = 0; kx < kernSize; kx++) {
        for (let ky = 0; ky < kernSize; ky++) {
          const x2 = clamp(x + kx - kernHalfSize, 0, width - 1);
          const y2 = clamp(y + ky - kernHalfSize, 0, height - 1);
          const idx2 = (x2 + y2 * width) * 4;
          const luminance2 = getLuminance(input[idx2], input[idx2 + 1], input[idx2 + 2]);

          const kidx = kx + (ky * kernSize);
          const weight = kern[kidx] * lumGaussian(luminance - luminance2);
          weightSum += weight;

          r += input[idx2 + 0] * weight;
          g += input[idx2 + 1] * weight;
          b += input[idx2 + 2] * weight;
        }
      }
      weightSum = Math.max(0.00001, weightSum);
      output[idx + 0] = clampInt(r / weightSum, 0, 255);
      output[idx + 1] = clampInt(g / weightSum, 0, 255);
      output[idx + 2] = clampInt(b / weightSum, 0, 255);
      output[idx + 3] = 255;
    }
  }
  return output;
};
