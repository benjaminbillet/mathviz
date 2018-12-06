import * as D3Random from 'd3-random';
import { forEachPixel } from '../utils/picture';
import { upscale2 } from '../utils/upscale';

export const DEFAULT_NORMAL_DISTRIBUTION = D3Random.randomNormal(0, 1);
export const makeValueNoise = (buffer, width, height, distribution = DEFAULT_NORMAL_DISTRIBUTION, bw = false) => {
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    if (bw === true) {
      r = g = b = distribution();
    } else {
      r = distribution();
      g = distribution();
      b = distribution();
    }
    buffer[idx + 0] = r;
    buffer[idx + 1] = g;
    buffer[idx + 2] = b;
    buffer[idx + 3] = a;
  });
  return buffer;
};

export const makeSampledValueNoise = (noiseWidth, noiseHeight, outputWidth, outputHeight, sampler = 'Bicubic', distribution = DEFAULT_NORMAL_DISTRIBUTION, bw = false) => {
  const buffer = new Float32Array(noiseWidth * noiseHeight * 4);
  makeValueNoise(buffer, noiseWidth, noiseHeight, distribution, bw);
  return upscale2(buffer, noiseWidth, noiseHeight, outputWidth, outputHeight, sampler);
};
