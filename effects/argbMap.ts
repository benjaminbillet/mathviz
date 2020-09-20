import { normalizeBuffer, forEachPixel } from '../utils/picture';
import { toARGBInteger } from '../utils/color';
import { PlotBuffer } from '../utils/types';

export const applyARGBMap = (input: PlotBuffer, width: number, height: number) => {
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    const argb = toARGBInteger(r * 255, g * 255, b * 255, a);
    input[idx + 0] = argb;
    input[idx + 1] = argb;
    input[idx + 2] = argb;
  });

  normalizeBuffer(input, width, height);
  return input;
};
