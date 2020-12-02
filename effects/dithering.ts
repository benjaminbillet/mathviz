import { clamp } from '../utils/misc';
import { Palette } from '../utils/types';
import { getClosestColor } from '../utils/palette';

export const applyDithering = (input: Float32Array, width: number, height: number, palette: Palette) => {
  const output = new Float32Array(input);
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const idx = (i + j * width) * 4;
      const r = input[idx + 0];
      const g = input[idx + 1];
      const b = input[idx + 2];
      const color = getClosestColor(palette, r, g, b);

      // https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
      output[idx + 0] = color[0];
      output[idx + 1] = color[1];
      output[idx + 2] = color[2];

      const er = r - color[0];
      const eg = g - color[1];
      const eb = b - color[2];
      propagateDiffusionError(input, width, height, i, j, er, eg, eb);
    }
  }
  return output;
};

export const propagateDiffusionError = (buffer: Float32Array, width: number, height: number, i: number, j: number, er: number, eg: number, eb: number) => {
  let idx = null;
  if (i + 1 < width) {
    idx = (i + 1 + j * width) * 4;
    buffer[idx + 0] = clamp(buffer[idx + 0] + er * 7/16, 0, 1);
    buffer[idx + 1] = clamp(buffer[idx + 1] + eg * 7/16, 0, 1);
    buffer[idx + 2] = clamp(buffer[idx + 2] + eb * 7/16, 0, 1);

    if (j + 1 < height) {
      idx = (i + 1 + (j + 1) * width) * 4;
      buffer[idx + 0] = clamp(buffer[idx + 0] + er * 1/16, 0, 1);
      buffer[idx + 1] = clamp(buffer[idx + 1] + eg * 1/16, 0, 1);
      buffer[idx + 2] = clamp(buffer[idx + 2] + eb * 1/16, 0, 1);
    }
  }
  if (j + 1 < height) {
    idx = (i + (j + 1) * width) * 4;
    buffer[idx + 0] = clamp(buffer[idx + 0] + er * 5/16, 0, 1);
    buffer[idx + 1] = clamp(buffer[idx + 1] + eg * 5/16, 0, 1);
    buffer[idx + 2] = clamp(buffer[idx + 2] + eb * 5/16, 0, 1);

    if (i - 1 >= 0) {
      idx = (i - 1 + (j + 1) * width) * 4;
      buffer[idx + 0] = clamp(buffer[idx + 0] + er * 3/16, 0, 1);
      buffer[idx + 1] = clamp(buffer[idx + 1] + eg * 3/16, 0, 1);
      buffer[idx + 2] = clamp(buffer[idx + 2] + eb * 3/16, 0, 1);
    }
  }
};
