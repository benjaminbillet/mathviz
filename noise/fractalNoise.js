import { normalizeBuffer } from '../utils/picture';
import { makePerlinNoise } from './perlinNoise';
import { makeSimplexNoise } from './simplexNoise';

export const makeOctavePerlinNoise = (width, height, octaves = 8, initialFrequency = 1, persistence = 0.5) => {
  const merged = new Float32Array(width * height * 4).fill(0);

  let frequency = initialFrequency;
  let amplitude = 1;
  for (let i = 0; i < octaves; i++) {
    const buffer = makePerlinNoise(width, height, frequency);
    buffer.forEach((x, i) => merged[i] += x * amplitude);

    amplitude *= persistence;
    frequency *= 2;
  }

  return normalizeBuffer(merged, width, height);
};

export const makeOctaveSimplexNoise = (width, height, octaves = 8, initialFrequency = 1, persistence = 0.5) => {
  const merged = new Float32Array(width * height * 4).fill(0);

  let frequency = initialFrequency;
  let amplitude = 1;
  for (let i = 0; i < octaves; i++) {
    const buffer = makeSimplexNoise(width, height, frequency);
    buffer.forEach((x, i) => merged[i] += x * amplitude);

    amplitude *= persistence;
    frequency *= 2;
  }

  return normalizeBuffer(merged, width, height);
};
