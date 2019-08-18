import { distanceCenterMask } from '../utils/mask';
import { convolve, HorizontalDerivative3x3Kernel, VerticalDerivative3x3Kernel } from '../utils/convolution';
import { refract2 } from './refract';
import { normalizeBuffer } from '../utils/picture';
import { euclidean2d } from '../utils/distance';

const logDistance2d = (x1, y1, x2, y2) => Math.log(euclidean2d(x1, y1, x2, y2) + 0.001);

export const applyVortex = (input, width, height, intensity = 0.2) => {
  const displacement = distanceCenterMask(logDistance2d, width, height);

  const horizontalDerivative = convolve(displacement, new Float32Array(input.length), width, height, HorizontalDerivative3x3Kernel);
  normalizeBuffer(horizontalDerivative, width, height);
  const verticalDerivative = convolve(displacement, new Float32Array(input.length), width, height, VerticalDerivative3x3Kernel);
  normalizeBuffer(verticalDerivative, width, height);

  return refract2(input, horizontalDerivative, verticalDerivative, width, height, intensity);
};

