import { forEachPixel } from '../utils/picture';
import { getLuminance } from '../utils/color';
import { UpscaleSamplers } from '../utils/upscale';
import { PlotBuffer } from '../utils/types';

export const refract = (input: PlotBuffer, displacement: PlotBuffer, width: number, height: number, intensity = 1, sampler = UpscaleSamplers.Bicubic): PlotBuffer => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(displacement, width, height, (r, g, b, a, i, j, idx) => {
    const l = getLuminance(r, g, b) * intensity;
    const x = (i + width * l) % width;
    const y = (j + height * l) % height;
    output[idx + 0] = sampler(input, width, height, x, y, 0);
    output[idx + 1] = sampler(input, width, height, x, y, 1);
    output[idx + 2] = sampler(input, width, height, x, y, 2);
    output[idx + 3] = a;
  });
  return output;
};

export const refract2 = (input: PlotBuffer, displacementX: PlotBuffer, displacementY: PlotBuffer, width: number, height: number, intensity = 1, sampler = UpscaleSamplers.Bicubic): PlotBuffer => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    const lx = getLuminance(displacementX[idx + 0], displacementX[idx + 1], displacementX[idx + 2]) * intensity;
    const ly = getLuminance(displacementY[idx + 0], displacementY[idx + 1], displacementY[idx + 2]) * intensity;
    const x = (i + width * lx) % width;
    const y = (j + height * ly) % height;
    output[idx + 0] = sampler(input, width, height, x, y, 0);
    output[idx + 1] = sampler(input, width, height, x, y, 1);
    output[idx + 2] = sampler(input, width, height, x, y, 2);
    output[idx + 3] = a;
  });
  return output;
};
