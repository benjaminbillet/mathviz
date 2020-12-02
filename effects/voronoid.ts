import { makeWorleyNoise } from '../noise/worleyNoise';
import { refract } from './refract';
import { euclidean2d } from '../utils/distance';

export const applyVoronoid = (input: Float32Array, width: number, height: number, distance = euclidean2d, density = 0.1, nth = 0) => {
  const worley = makeWorleyNoise(width, height, distance, density, nth);
  const output = refract(input, worley, width, height, 0.5);
  return output;
};
