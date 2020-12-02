import { euclidean } from '../utils/distance';
import { makeWorleyLogSumNoise } from '../noise/worleyNoise';
import { refract } from './refract';
import { randomInteger } from '../utils/random';

export const applyAgate = (input: Float32Array, width: number, height: number, distance = euclidean, density = 0.1) => {
  const worley = makeWorleyLogSumNoise(width, height, distance, density);
  return refract(input, worley, width, height, randomInteger(8, 12));
};
