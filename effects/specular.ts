import { convolve, makeGaussianKernel } from '../utils/convolution';
import { normal3 } from '../utils/vector';
import { phongSpecular } from '../utils/illumination';
import { clamp } from '../utils/misc';
import { getLuminance } from '../utils/color';

export const applySpecularIllumination = (input: Float32Array, width: number, height: number, lightDirection: number[], viewDirection: number[]) => {
  let speculars = applySpeculars(input, width, height, lightDirection, viewDirection);
  speculars = convolve(speculars, new Float32Array(width * height * 4).fill(0), width, height, makeGaussianKernel(3));
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      speculars[idx + 0] = clamp(speculars[idx + 0] + input[idx + 0], 0, 1);
      speculars[idx + 1] = clamp(speculars[idx + 1] + input[idx + 1], 0, 1);
      speculars[idx + 2] = clamp(speculars[idx + 2] + input[idx + 2], 0, 1);
      speculars[idx + 3] = 1;
    }
  }
  return speculars;
};

export const applySpeculars = (input: Float32Array, width: number, height: number, lightDirection: number[], viewDirection: number[]) => {
  const speculars = new Float32Array(width * height * 4).fill(0);
  for (let i = 0; i < width - 1; i++) {
    for (let j = 0; j < height - 1; j++) {
      const inIdx1 = (i + j * width) * 4;
      const inIdx2 = (i + 1 + j * width) * 4;
      const inIdx3 = (i + (j + 1) * width) * 4;
      const outIdx = inIdx1;

      const l1 = computeLuminance(input[inIdx1 + 0], input[inIdx1 + 1], input[inIdx1 + 2]);
      const l2 = computeLuminance(input[inIdx2 + 0], input[inIdx2 + 1], input[inIdx2 + 2]);
      const l3 = computeLuminance(input[inIdx3 + 0], input[inIdx3 + 1], input[inIdx3 + 2]);
      const normal = normal3(i, j, l1 * width, i + 1, j, l2 * width, i, j + 1, l3 * width);

      speculars[outIdx + 0] = phongSpecular(normal, viewDirection, lightDirection);
      speculars[outIdx + 1] = speculars[outIdx + 0];
      speculars[outIdx + 2] = speculars[outIdx + 0];
      speculars[outIdx + 3] = 1;
    }
  }
  return speculars;
};

const computeLuminance = (r: number, g: number, b: number) => {
  if (r !== g || r !== b || g !== b) {
    return getLuminance(r, g, b);
  }
  return r;
};