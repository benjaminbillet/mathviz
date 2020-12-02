import { forEachPixel } from '../utils/picture';

export const applyInvert = (input: Float32Array, width: number, height: number) => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = 1 - r;
    output[idx + 1] = 1 - g;
    output[idx + 2] = 1 - b;
    output[idx + 3] = a;
  });
  return output;
};
