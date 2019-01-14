import { forEachPixel } from '../utils/picture';
import { getLuminance } from '../utils/color';

export const applyBinaryMap = (input, width, height) => {
  const output = new Uint8Array(width * height * 4);
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    const luminance = Math.round(getLuminance(r, g, b));
    output[idx + 0] = luminance;
    output[idx + 1] = luminance;
    output[idx + 2] = luminance;
    output[idx + 3] = a;
  });
  return output;
};
