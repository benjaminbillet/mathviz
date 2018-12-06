import { saveImageBuffer, normalizeBuffer } from '../utils/picture';
import { convertUnitToRGBA, adjustHsl } from '../utils/color';
import { randomScalar } from '../utils/random';
import { upscale2 } from '../utils/upscale';
import { blendCosine, blendCosineCenter } from '../utils/blend';
import { makeSampledValueNoise, DEFAULT_NORMAL_DISTRIBUTION } from '../noise/valueNoise';
import { uniformMask } from '../utils/mask';
import { refract } from './refract';

// the crt effect will:
// 1. add distorted scanlines
// 2. change the hue and saturation of the image

export const applyCrt = (input, width, height, distortionAmount = 0.25) => {
  // create a normalized copy of the input image
  input = new Float32Array(input);
  normalizeBuffer(input, width, height);

  // create a gradient for distortion
  const distortion = makeSampledValueNoise(3, 3, width, height, 'Bicubic', DEFAULT_NORMAL_DISTRIBUTION, true);
  normalizeBuffer(distortion, width, height);

  // refract a pixellated white noise using the gradient
  let whiteNoise = makeSampledValueNoise(height * 0.75, height * 0.7, width, height, 'NearestNeighbor', () => DEFAULT_NORMAL_DISTRIBUTION() - 0.5, true);
  whiteNoise = refract(whiteNoise, distortion, width, height, distortionAmount);

  // blend the refracted noise with another noise
  let whiteNoise2 = makeSampledValueNoise(width * 0.25, height * 0.5, width, height, 'Bicubic', DEFAULT_NORMAL_DISTRIBUTION, true);
  normalizeBuffer(whiteNoise2, width, height);
  whiteNoise2 = blendCosineCenter(whiteNoise2, refract(whiteNoise2, distortion, width, height, distortionAmount), width, height);

  // create some scanlines
  const thirdHeight = height * 0.333;
  let scanNoise = new Float32Array(width * thirdHeight * 4);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      scanNoise[idx + 0] = j % 2 === 0 ? 0 : 1;
      scanNoise[idx + 1] = j % 2 === 0 ? 0 : 1;
      scanNoise[idx + 2] = j % 2 === 0 ? 0 : 1;
      scanNoise[idx + 3] = 255;
    }
  }
  scanNoise = upscale2(scanNoise, width, thirdHeight, width, height, 'Bicubic');

  // blend the scanlines with refracted scanlines
  scanNoise = blendCosineCenter(scanNoise, refract(scanNoise, distortion, width, height, distortionAmount), width, height);

  // blend the first noise with the image, using the second noise as mask
  input = blendCosine(input, whiteNoise, whiteNoise2, width, height, 0.25);
  // blend the scanline with the image
  input = blendCosine(input, scanNoise, uniformMask(0.25, width, height), width, height);
  // adjust hue randomly and increase saturation
  input = adjustHsl(convertUnitToRGBA(input), width, height, randomScalar(0, 0.125), 0.125);

  return input;
};
