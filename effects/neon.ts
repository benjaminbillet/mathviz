import { normalizeBuffer } from '../utils/picture';
import { convertUnitToRGBA } from '../utils/color';
import { applyWormhole } from './wormhole';
import { SobelHorizontal3x3Kernel, SobelVertical3x3Kernel, convolve, Invert3x3Kernel, makeGaussianKernel, AvgBlur3x3Kernel } from '../utils/convolution';
import { makeWorleyLogSumNoise } from '../noise/worleyNoise';
import { euclidean } from '../utils/distance';
import { applyPosterize } from './posterize';
import { refract } from './refract';
import { applyChromaticAberration } from './chromaticAberration';
import { applyLuminanceMap } from './luminanceMap';
import { PlotBuffer } from '../utils/types';


export const applyNeon = (input: PlotBuffer, width: number, height: number) => {
  // create a normalized copy of the input image
  input = new Float32Array(input);
  normalizeBuffer(input, width, height);

  let output = applyLuminanceMap(input, width, height);
  output = applyPosterize(output, width, height, 10);

  /* const worley = makeWorleyLogSumNoise(new Float32Array(input.length), width, height);
  let output = applyPosterize(worley, width, height, 24);

  output = applyWormhole(output, width, height);

  output = convolve(output, new Float32Array(input.length), width, height, Invert3x3Kernel);
  normalizeBuffer(output, width, height);*/

  const sobelX = convolve(output, new Float32Array(input.length), width, height, SobelHorizontal3x3Kernel);
  const sobelY = convolve(output, new Float32Array(input.length), width, height, SobelVertical3x3Kernel);
  output = input.map((x, i) => euclidean(sobelX[i], sobelY[i]));
  normalizeBuffer(output, width, height);

  // output = convolve(output, new Float32Array(input.length), width, height, new Float32Array(5 * 5).fill(1 / (5 * 5)));
  // output = refract(input, output, width, height);
  output = applyChromaticAberration(output, width, height);
  return convertUnitToRGBA(output);
};
