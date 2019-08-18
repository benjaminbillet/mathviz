import { normalizeBuffer } from '../utils/picture';
import { randomInteger, DefaultNormalDistribution } from '../utils/random';
import { blendCosine } from '../utils/blend';
import { makeValueNoise } from '../noise/valueNoise';
import { UpscaleSamplers } from '../utils/upscale';

// the vhs effect will:
// 1. add lines of white noise
// 2. shift lines around the line noise
// => looks like a paused or rewinding vhs

export const applyVhs = (input, width, height) => {
  // generates a scan noise (horizontally-stretched squares) and a white noise
  const scanNoise = makeValueNoise(Math.trunc(width * 0.01) + 1, Math.trunc(height * 0.5) + 1, width, height, UpscaleSamplers.Bilinear, DefaultNormalDistribution, true);
  const whiteNoise = makeValueNoise(Math.trunc(width * 0.1) + 1, Math.trunc(height * 0.5) + 1, width, height, UpscaleSamplers.NearestNeighbor, DefaultNormalDistribution, true);

  // create a gradient (a few horizontal grayscale lines)
  const distribution = () => Math.pow(Math.max(0, DefaultNormalDistribution() - 0.5), 2);
  const grad = makeValueNoise(1, randomInteger(10, 15), width, height, UpscaleSamplers.Bilinear, distribution, true);
  normalizeBuffer(grad, width, height);

  // use the gradient as a mask for blending the white noise into the input picture
  const noised = blendCosine(input, whiteNoise, grad, width, height, 0.75);

  // use the gradient intensity to shift lines of the image
  const output = new Float32Array(noised.length);
  for (let j = 0; j < height; j++) {
    const idx = j * width * 4;
    const shift = Math.floor(((grad[idx] * 0.25) + (scanNoise[idx] * 0.25 * grad[idx] * grad[idx])) * width);

    for (let i = 0; i < width; i++) {
      const iidx = (((i + shift) % width) + j * width) * 4;
      const oidx = (i + j * width) * 4;
      output[oidx + 0] = noised[iidx + 0];
      output[oidx + 1] = noised[iidx + 1];
      output[oidx + 2] = noised[iidx + 2];
      output[oidx + 3] = noised[iidx + 3];
    }
  }

  return output;
};
