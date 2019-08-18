import { DefaultNormalDistribution, DefaultExponentialDistribution } from '../utils/random';
import { UpscaleSamplers } from '../utils/upscale';
import { blendLinear } from '../utils/blend';
import { makeValueNoise } from '../noise/valueNoise';
import { blackMask } from '../utils/mask';
import { normalizeBuffer } from '../utils/picture';

export const applyScanlineError = (input, width, height, intensity = 0.025) => {
  const errorSwerve = makeValueNoise(1, Math.trunc(height * 0.01), width, height, UpscaleSamplers.Bicubic, DefaultExponentialDistribution, true);
  normalizeBuffer(errorSwerve, width, height);
  errorSwerve.forEach((x, i) => errorSwerve[i] = Math.max(x - 0.5, 0));

  const errorLine = makeValueNoise(1, Math.trunc(height * 0.75), width, height, UpscaleSamplers.Bicubic, DefaultExponentialDistribution, true);
  normalizeBuffer(errorLine, width, height);
  errorLine.forEach((x, i) => errorLine[i] = Math.max(x - 0.5, 0) * errorSwerve[i]);

  let whiteNoise = makeValueNoise(1, Math.trunc(height * 0.75), width, height, UpscaleSamplers.Bicubic, DefaultNormalDistribution, true);
  normalizeBuffer(whiteNoise, width, height);
  whiteNoise = blendLinear(blackMask(width, height), whiteNoise, errorSwerve, width, height, 2);

  const error = whiteNoise.map((x, i) => x + errorLine[i]);

  // use the gradient intensity to shift lines of the image
  const output = new Float32Array(input.length);
  for (let j = 0; j < height; j++) {
    const idx = j * width * 4;
    const shift = Math.floor(error[idx] * width * intensity);

    for (let i = 0; i < width; i++) {
      const iidx = (((i + shift) % width) + j * width) * 4;
      const oidx = (i + j * width) * 4;
      output[oidx + 0] = input[iidx + 0];
      output[oidx + 1] = input[iidx + 1];
      output[oidx + 2] = input[iidx + 2];
      output[oidx + 3] = input[iidx + 3];
    }
  }

  output.forEach((x, i) => output[i] = Math.min(x + errorLine[i] * whiteNoise[i] * 8, 1));

  return output;
};
