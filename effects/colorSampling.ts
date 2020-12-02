
import { forEachPixel, setPixelValues } from '../utils/picture';
import { getLuminance } from '../utils/color';

// Re-color the given tensor, by sampling along one axis at a specified frequency.
export const applyColorSampling = (input: Float32Array, width: number, height: number, displacement = 0.5) => {
  const dimension = Math.min(width, height);
  const output = new Float32Array(input.length);
  forEachPixel(input, width, height, (r, g, b, a, i, j) => {
    const luminance = getLuminance(r, g, b);
    const x = (luminance * displacement * dimension + luminance) % width;
    const y = (luminance * displacement * dimension + luminance) % height;
    const idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;
    setPixelValues(output, width, height, i, j, input[idx + 0], input[idx + 1], input[idx + 2], input[idx + 3]);
  });
  return output;
};
