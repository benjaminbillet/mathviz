import { forEachPixel } from '../utils/picture';
import { PlotBuffer } from '../utils/types';

export const applyPosterize = (input: PlotBuffer, width: number, height: number, levels = 6) => {
  const offset = 1 / levels * 0.5;
  const output = new Float32Array(width * height * 4);
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = Math.floor(r * levels + offset) / levels;
    output[idx + 1] = Math.floor(g * levels + offset) / levels;
    output[idx + 2] = Math.floor(b * levels + offset) / levels;
    output[idx + 3] = a;
  });
  return output;
};
