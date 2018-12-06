import { forEachPixel } from '../utils/picture';
import { getLuminance } from '../utils/color';

export const refract = (buffer, displacement, width, height, intensity = 1) => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(displacement, width, height, (r, g, b, a, i, j, idx) => {
    const l = getLuminance(r, g, b) * intensity;
    const i2 = (i + Math.floor(width * l)) % width; // TODO interpolate instead of floor
    const j2 = (j + Math.floor(height * l)) % height; // TODO interpolate instead of floor
    const idx2 = (i2 + j2 * width) * 4;
    output[idx + 0] = buffer[idx2 + 0];
    output[idx + 1] = buffer[idx2 + 1];
    output[idx + 2] = buffer[idx2 + 2];
    output[idx + 3] = a;
  });
  return output;
};
