import { euclidean } from '../utils/distance';
import { convolve, SobelVertical3x3Kernel, SobelHorizontal3x3Kernel } from '../utils/convolution';
import { normalizeBuffer, forEachPixel } from '../utils/picture';
import { applyLuminanceMap } from './luminanceMap';

export const applyNormalMap = (input, width, height) => {
  const luminanceMap = applyLuminanceMap(input, width, height);

  const horizontalDerivative = convolve(luminanceMap, new Float32Array(input.length), width, height, SobelHorizontal3x3Kernel);
  horizontalDerivative.forEach((x, i) => horizontalDerivative[i] = 1 - x);
  normalizeBuffer(horizontalDerivative, width, height);

  const verticalDerivative = convolve(luminanceMap, new Float32Array(input.length), width, height, SobelVertical3x3Kernel);
  normalizeBuffer(verticalDerivative, width, height);

  const output = input.map((_, i) => euclidean(horizontalDerivative[i], verticalDerivative[i]));
  normalizeBuffer(output, width, height);

  forEachPixel(output, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = horizontalDerivative[idx + 0];
    output[idx + 1] = verticalDerivative[idx + 0];
    output[idx + 2] = 1 - Math.abs(b * 2 - 1) * 0.5 + 0.5;
  });

  return output;
};
