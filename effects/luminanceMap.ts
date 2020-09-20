import { forEachPixel } from '../utils/picture';
import { getLuminance } from '../utils/color';
import { PlotBuffer } from '../utils/types';

export const applyLuminanceMap = (input: PlotBuffer, width: number, height: number): PlotBuffer => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    const luminance = getLuminance(r, g, b);
    output[idx + 0] = luminance;
    output[idx + 1] = luminance;
    output[idx + 2] = luminance;
    output[idx + 3] = a;
  });
  return output;
};
