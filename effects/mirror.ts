import { forEachPixel } from '../utils/picture';
import { PlotBuffer } from '../utils/types';

export const mirror = (input: PlotBuffer, width: number, height: number, vertical = true, horizontal = true) => {
  let outputWidth = width;
  let outputHeight = height;
  if (vertical) {
    outputHeight *= 2;
  }
  if (horizontal) {
    outputWidth *= 2;
  }

  const output = new Float32Array(outputWidth * outputHeight * 4);
  forEachPixel(output, outputWidth, outputHeight, (r, g, b, a, i, j, idx) => {
    let i2 = i;
    if (i >= width) {
      i2 = i - (i - width) * 2 - 1;
    }
    let j2 = j;
    if (j >= height) {
      j2 = j - (j - height) * 2 - 1;
    }

    const idx2 = (i2 + j2 * width) * 4;
    output[idx + 0] = input[idx2 + 0];
    output[idx + 1] = input[idx2 + 1];
    output[idx + 2] = input[idx2 + 2];
    output[idx + 3] = 255;
  });
  return output;
};
