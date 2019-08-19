import { refract2 } from './refract';
import { makeValueNoise } from '../noise/valueNoise';
import { DefaultUniformDistribution } from '../utils/random';
import { UpscaleSamplers } from '../utils/upscale';

export const applyWarp = (input, width, height, freq = 1, octaves = 5, displacement = 0.5, sampler = UpscaleSamplers.Bicubic) => {
  let output = new Float32Array(input);

  let freqX = freq;
  let freqY = freq;
  if (height < width) {
    freqX = Math.trunc(freq * width / height);
  } else if (width > height) {
    freqY = Math.trunc(freq * height / width);
  }

  let factor = 1;
  for (let octave = 1; octave < octaves + 1; octave++) {
    factor *= 2;

    const iwidth = Math.trunc(freqX * factor / 2);
    const iheight = Math.trunc(freqY * factor / 2);
    if (iwidth >= width || iheight >= height) {
      break;
    }

    const refractX = makeValueNoise(iwidth, iheight, width, height, sampler, DefaultUniformDistribution, true);
    const refractY = makeValueNoise(iwidth, iheight, width, height, sampler, DefaultUniformDistribution, true);
    output = refract2(output, refractX, refractY, width, height, displacement / factor, sampler);
  }

  return output;
};
