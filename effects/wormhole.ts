import { normalizeBuffer } from '../utils/picture';
import { getLuminance } from '../utils/color';

export const applyWormhole = (input: Float32Array, width: number, height: number, period = 2.5, stride = 0.1) => {
  stride = stride * height;
  const output = new Float32Array(input.length).fill(0);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const iidx = (i + j * width) * 4;
      const r = input[iidx + 0];
      const g = input[iidx + 1];
      const b = input[iidx + 2];

      const luminance = getLuminance(r, g, b);
      const luminanceSquared = luminance * luminance;

      const degrees = luminance * Math.PI * 2 * period;
      let x = (i + (Math.sin(degrees) + 1) * stride) % width;
      x = (x + width) % width;
      let y = (j + (Math.cos(degrees) + 1) * stride) % height;
      y = (y + height) % height;

      const oidx = (Math.floor(x) + Math.floor(y) * width) * 4;
      output[oidx + 0] += luminanceSquared * input[oidx + 0];
      output[oidx + 1] += luminanceSquared * input[oidx + 1];
      output[oidx + 2] += luminanceSquared * input[oidx + 2];
    }
  }
  normalizeBuffer(output, width, height);

  for (let i = 0; i < input.length; i += 4) {
    output[i + 0] = Math.sqrt(output[i + 0]);
    output[i + 1] = Math.sqrt(output[i + 1]);
    output[i + 2] = Math.sqrt(output[i + 2]);
    output[i + 3] = input[i + 3];
  }
  return output;
};
