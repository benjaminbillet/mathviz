import { normalizeBuffer } from '../utils/picture';
import { convolve, Invert3x3Kernel } from '../utils/convolution';
import { applyDensityMap } from '../effects/densityMap';
import { applyThreads, DefaultStrideDistribution, ChaoticBehavior } from '../effects/threads';
import { PlotBuffer } from '../utils/types';

export const makeSoupNoise = (inputNoise: PlotBuffer, width: number, height: number) => {
  const nbWorms = Math.min(width, height);
  let output: PlotBuffer = applyThreads(inputNoise, width, height, nbWorms, 4, 5, DefaultStrideDistribution, ChaoticBehavior);
  normalizeBuffer(output, width, height);
  output = output.map(x => Math.sqrt(x));

  output = applyDensityMap(output, width, height);
  convolve(output, new Float32Array(width * height * 4), width, height, Invert3x3Kernel);
  normalizeBuffer(output, width, height);

  return output;
};
