import { applyColorSampling } from './colorSampling';
import { randomInteger } from '../utils/random';
import { applyGlowingEdges } from './glowingEdges';
import { hslMultiply } from '../utils/color';
import { applyPosterize } from './posterize';
import { applyBloom } from './bloom';
import { forEachPixel, normalizeBuffer } from '../utils/picture';

export const applyIcification = (input: Float32Array, width: number, height: number) => {
  let output = applyColorSampling(input, width, height, randomInteger(3, 4));
  output = applyPosterize(output, width, height, 3);
  output = applyGlowingEdges(output, width, height);
  output = applyBloom(output, width, height, randomInteger(2, 4));
  output = hslMultiply(output, width, height, 1, 0.25, 1);

  forEachPixel(output, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 2] *= 1.1;
  });

  normalizeBuffer(output, width, height);
  return output;
};
