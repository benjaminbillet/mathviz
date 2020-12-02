import { normalizeBuffer, forEachPixel } from '../utils/picture';
import { makeValueNoise } from '../noise/valueNoise';
import { clampInt } from '../utils/misc';
import { UpscaleSamplers } from '../utils/upscale';
import { DefaultNormalDistribution } from '../utils/random';


export const applyChromaticAberration = (input: Float32Array, width: number, height: number, intensity = 5) => {
  const output = new Float32Array(input);

  const distortion = makeValueNoise(3, 3, width, height, UpscaleSamplers.Bicubic, DefaultNormalDistribution, true);
  normalizeBuffer(distortion, width, height);

  forEachPixel(input, width, height, (r, g, b, a, x, y, idx) => {
    output[idx + 0] = r;
    output[idx + 4] = a;

    const factor = 1 + intensity * distortion[idx + 0];

    const xg = clampInt(x + factor, 0, width);
    const yg = clampInt(y + factor, 0, height);
    output[(xg + yg * width) * 4 + 1] = g;

    const xb = clampInt(x - factor, 0, width);
    const yb = clampInt(y - factor, 0, height);
    output[(xb + yb * width) * 4 + 2] = b;
  });

  return output;
};

