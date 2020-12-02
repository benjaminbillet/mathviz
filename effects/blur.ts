import { Optional } from '../utils/types';
import { AvgBlur3x3Kernel, convolve, makeGaussianKernel } from '../utils/convolution';

export const applyGaussianBlur = (input: Float32Array, width: number, height: number, kernSize = 3, sigma?: Optional<number>) => {
  return convolve(input, new Float32Array(input.length), width, height, makeGaussianKernel(kernSize, sigma));
};

export const applyAverageBlur = (input: Float32Array, width: number, height: number) => {
  return convolve(input, new Float32Array(input.length), width, height, AvgBlur3x3Kernel);
};