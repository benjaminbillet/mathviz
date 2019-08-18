import { euclidean2d } from '../utils/distance';
import { convolve, HorizontalDerivative3x3Kernel, VerticalDerivative3x3Kernel } from '../utils/convolution';
import { refract2 } from './refract';
import { normalizeBuffer } from '../utils/picture';
import { makeWorleyNoise } from '../noise/worleyNoise';


export const applyVoroshard = (input, width, height, intensity = 0.2, distance = euclidean2d, density = 1, nth = 0) => {
  const displacement = makeWorleyNoise(width, height, distance, density, nth);

  const horizontalDerivative = convolve(displacement, new Float32Array(input.length), width, height, HorizontalDerivative3x3Kernel);
  normalizeBuffer(horizontalDerivative, width, height);
  const verticalDerivative = convolve(displacement, new Float32Array(input.length), width, height, VerticalDerivative3x3Kernel);
  normalizeBuffer(verticalDerivative, width, height);

  return refract2(input, horizontalDerivative, verticalDerivative, width, height, intensity);
};
