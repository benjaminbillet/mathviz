import { euclidean } from '../utils/distance';
import { convolve, HorizontalDerivative3x3Kernel, VerticalDerivative3x3Kernel, SobelVertical3x3Kernel, SobelHorizontal3x3Kernel, PrewittHorizontal3x3Kernel, PrewittVertical3x3Kernel } from '../utils/convolution';
import { normalizeBuffer } from '../utils/picture';

// TODO Scharr derivative

export const applyDerivative = (input: Float32Array, width: number, height: number, distance = euclidean) => {
  const horizontalDerivative = convolve(input, new Float32Array(input.length), width, height, HorizontalDerivative3x3Kernel);
  const verticalDerivative = convolve(input, new Float32Array(input.length), width, height, VerticalDerivative3x3Kernel);

  const output = new Float32Array(input.length);
  for (let i = 0; i < input.length; i += 4) {
    output[i + 0] = distance(horizontalDerivative[i + 0], verticalDerivative[i + 0]);
    output[i + 1] = distance(horizontalDerivative[i + 1], verticalDerivative[i + 1]);
    output[i + 2] = distance(horizontalDerivative[i + 2], verticalDerivative[i + 2]);
    output[i + 3] = input[i + 3];
  }
  return output;
};

export const applySobelDerivative = (input: Float32Array, width: number, height: number, distance = euclidean) => {
  const horizontalDerivative = convolve(input, new Float32Array(input.length), width, height, SobelHorizontal3x3Kernel);
  const verticalDerivative = convolve(input, new Float32Array(input.length), width, height, SobelVertical3x3Kernel);
  const output = input.map((_, i) => distance(horizontalDerivative[i], verticalDerivative[i]));

  normalizeBuffer(output, width, height);
  for (let i = 0; i < input.length; i += 4) {
    output[i + 0] = 1 - Math.abs(output[i + 0] * 2 - 1);
    output[i + 1] = 1 - Math.abs(output[i + 1] * 2 - 1);
    output[i + 2] = 1 - Math.abs(output[i + 2] * 2 - 1);
    output[i + 3] = input[i + 3];
  }
  return output;
};

export const applyPrewittDerivative = (input: Float32Array, width: number, height: number, distance = euclidean) => {
  const horizontalDerivative = convolve(input, new Float32Array(input.length), width, height, PrewittHorizontal3x3Kernel);
  const verticalDerivative = convolve(input, new Float32Array(input.length), width, height, PrewittVertical3x3Kernel);
  const output = input.map((_, i) => distance(horizontalDerivative[i], verticalDerivative[i]));

  normalizeBuffer(output, width, height);
  for (let i = 0; i < input.length; i += 4) {
    output[i + 0] = 1 - Math.abs(output[i + 0] * 2 - 1);
    output[i + 1] = 1 - Math.abs(output[i + 1] * 2 - 1);
    output[i + 2] = 1 - Math.abs(output[i + 2] * 2 - 1);
    output[i + 3] = input[i + 3];
  }
  return output;
};
