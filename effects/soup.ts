import { euclidean } from '../utils/distance';
import { convolve, makeGaussianKernel } from '../utils/convolution';
import { applyLuminanceMap } from './luminanceMap';
import { makeWorleyLogSumNoise } from '../noise/worleyNoise';
import { uniformMask } from '../utils/mask';
import { blendCosine } from '../utils/blend';
import { makeSoupNoise } from '../noise/soupNoise';
import { applyPosterize } from './posterize';
import { applySobelDerivative } from './derivative';
import { applyInvert } from './invert';

export const applySoup1 = (input: Float32Array, width: number, height: number, blend = 0.3, distance = euclidean) => {
  // blur the picture to attenuate details
  input = convolve(input, new Float32Array(input.length), width, height, makeGaussianKernel(10));
  // convert to black
  input = applyLuminanceMap(input, width, height);

  // blend the image with a worley noise
  const worley = makeWorleyLogSumNoise(width, height, distance);
  const merged = blendCosine(worley, input, uniformMask(blend, width, height), width, height);

  return makeSoupNoise(merged, width, height);
};

export const applySoup2 = (input: Float32Array, width: number, height: number) => {
  // posterize to remove more details
  input = applyPosterize(input, width, height, 10);
  // blur the picture to attenuate details
  input = convolve(input, new Float32Array(input.length), width, height, makeGaussianKernel(10));
  // convert to black
  input = applyLuminanceMap(input, width, height);

  return makeSoupNoise(input, width, height);
};

export const applySoup3 = (input: Float32Array, width: number, height: number) => {
  // posterize to remove more details
  input = applyPosterize(input, width, height, 10);
  // convert to black
  input = applyLuminanceMap(input, width, height);
  // blur the picture to attenuate details
  input = convolve(input, new Float32Array(input.length), width, height, makeGaussianKernel(10));
  // apply sobel and invert
  input = applySobelDerivative(input, width, height);
  input = applyInvert(input, width, height);

  return makeSoupNoise(input, width, height);
};

export const applySoup4 = (input: Float32Array, width: number, height: number) => {
  // blur the picture to attenuate details
  input = convolve(input, new Float32Array(input.length), width, height, makeGaussianKernel(10));
  // posterize to remove more details
  input = applyPosterize(input, width, height, 5);
  // convert to black
  input = applyLuminanceMap(input, width, height);

  return makeSoupNoise(input, width, height);
};
