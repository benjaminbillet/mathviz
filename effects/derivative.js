import { euclidean } from '../utils/distance';
import { convolve, HorizontalDerivative3x3Kernel, VerticalDerivative3x3Kernel, SobelVertical3x3Kernel, SobelHorizontal3x3Kernel, PrewittHorizontal3x3Kernel, PrewittVertical3x3Kernel } from '../utils/convolution';
import { normalizeBuffer } from '../utils/picture';

export const applyDerivative = (input, width, height, distance = euclidean) => {
  const horizontalDerivative = convolve(input, new Float32Array(input.length), width, height, HorizontalDerivative3x3Kernel);
  const verticalDerivative = convolve(input, new Float32Array(input.length), width, height, VerticalDerivative3x3Kernel);
  return input.map((x, i) => distance(horizontalDerivative[i], verticalDerivative[i]));
};

export const applySobelDerivative = (input, width, height, distance = euclidean) => {
  const horizontalDerivative = convolve(input, new Float32Array(input.length), width, height, SobelHorizontal3x3Kernel);
  const verticalDerivative = convolve(input, new Float32Array(input.length), width, height, SobelVertical3x3Kernel);
  let output = input.map((_, i) => distance(horizontalDerivative[i], verticalDerivative[i]));
  normalizeBuffer(output, width, height);
  output.forEach((x, i) => output[i] = 1 - Math.abs(x * 2 - 1));
  return output;
};

export const applyPrewittDerivative = (input, width, height, distance = euclidean) => {
  const horizontalDerivative = convolve(input, new Float32Array(input.length), width, height, PrewittHorizontal3x3Kernel);
  const verticalDerivative = convolve(input, new Float32Array(input.length), width, height, PrewittVertical3x3Kernel);
  let output = input.map((_, i) => distance(horizontalDerivative[i], verticalDerivative[i]));
  normalizeBuffer(output, width, height);
  output.forEach((x, i) => output[i] = 1 - Math.abs(x * 2 - 1));
  return output;
};
