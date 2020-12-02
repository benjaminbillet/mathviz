import { forEachPixel } from '../utils/picture';
import { blendLinear } from '../utils/blend';
import { grayMask } from '../utils/mask';
import { downscale2 } from '../utils/downscale';
import { clampInt } from '../utils/misc';
import { upscale2 } from '../utils/upscale';

export const applyBloom = (input: Float32Array, width: number, height: number, intensity = 1) => {
  const output = new Float32Array(input.length);
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = Math.max(r * 2 - 1, 0);
    output[idx + 1] = Math.max(g * 2 - 1, 0);
    output[idx + 2] = Math.max(b * 2 - 1, 0);
    output[idx + 3] = a;
  });

  const newWidth = clampInt(width * 0.01, 1, width);
  const newHeight = clampInt(height * 0.01, 1, height);
  let blurred = downscale2(output, width, height, newWidth, newHeight);
  blurred = upscale2(blurred, newWidth, newHeight, width, height);

  const offsetBlurred = new Float32Array(blurred.length);
  forEachPixel(offsetBlurred, width, height, (r, g, b, a, i, j, idx) => {
    let x = (i - (width * 0.005)) % width;
    x = (x + width) % width;
    let y = (j - (height * 0.005)) % height;
    y = (y + height) % height;

    const idx2 = (Math.floor(x) + Math.floor(y) * width) * 4;
    offsetBlurred[idx + 0] = blurred[idx2 + 0] * intensity;
    offsetBlurred[idx + 1] = blurred[idx2 + 1] * intensity;
    offsetBlurred[idx + 2] = blurred[idx2 + 2] * intensity;
  });

  forEachPixel(offsetBlurred, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = 1 - ((1 - r) * (1 - input[idx + 0]));
    output[idx + 1] = 1 - ((1 - g) * (1 - input[idx + 1]));
    output[idx + 2] = 1 - ((1 - b) * (1 - input[idx + 2]));
    output[idx + 3] = input[idx + 3]
  });

  return blendLinear(input, output, grayMask(width, height), width, height);
};
