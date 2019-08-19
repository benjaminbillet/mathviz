import { applyLuminanceMap } from './luminanceMap';
import { applyPosterize } from './posterize';
import { randomInteger } from '../utils/random';
import { applySobelDerivative } from './derivative';
import { convolve, makeGaussianKernel } from '../utils/convolution';
import { forEachPixel, normalizeBuffer } from '../utils/picture';
import { manhattan } from '../utils/distance';
import { blendLinear } from '../utils/blend';
import { grayMask } from '../utils/mask';

// Re-color the given tensor, by sampling along one axis at a specified frequency.
export const applyGlowingEdges = (input, width, height) => {
  let output = applyLuminanceMap(input, width, height);
  output = applyPosterize(output, width, height, randomInteger(3, 5));
  output = applySobelDerivative(output, width, height, manhattan);

  forEachPixel(output, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = Math.min(1, 8 * r) * Math.min(1, 1.25 * input[idx + 0]);
    output[idx + 1] = Math.min(1, 8 * g) * Math.min(1, 1.25 * input[idx + 1]);
    output[idx + 2] = Math.min(1, 8 * b) * Math.min(1, 1.25 * input[idx + 2]);
  });

  const blurred = convolve(output, new Float32Array(output.length), width, height, makeGaussianKernel(3));
  forEachPixel(blurred, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] += r;
    output[idx + 1] += g;
    output[idx + 2] += b;
  });
  normalizeBuffer(output, width, height);

  forEachPixel(output, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = 1 - ((1 - r) * (1 - input[idx + 0]));
    output[idx + 1] = 1 - ((1 - g) * (1 - input[idx + 1]));
    output[idx + 2] = 1 - ((1 - b) * (1 - input[idx + 2]));
  });

  return blendLinear(input, output, grayMask(width, height), width, height);
};
