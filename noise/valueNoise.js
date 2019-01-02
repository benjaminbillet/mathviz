import { forEachPixel } from '../utils/picture';
import { upscale2, UpscaleSamplers } from '../utils/upscale';
import { DefaultNormalDistribution } from '../utils/random';

// the value noise method consists into building a lattice of random values that are interpolated to form the final noise.

export const makeValueNoise = (noiseWidth, noiseHeight, outputWidth, outputHeight, sampler = UpscaleSamplers.Bicubic, distribution = DefaultNormalDistribution, bw = false) => {
  const buffer = new Float32Array(noiseWidth * noiseHeight * 4);

  // we initialize a set of randomly-valued pixels
  forEachPixel(buffer, noiseWidth, noiseHeight, (r, g, b, a, i, j, idx) => {
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

  // then upscale the picture using the given sampler for interpolation
  return upscale2(buffer, noiseWidth, noiseHeight, outputWidth, outputHeight, sampler);
};
