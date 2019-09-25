import { normalizeBuffer, forEachPixel } from '../utils/picture';
import { makePerlinNoiseFunction } from './perlinNoise';
import { makeSimplexNoiseFunction } from './simplexNoise';

export const makeOctavePerlinNoise = (width, height, octaves = 8, initialFrequency = 1, persistence = 0.5) => {
  return plotOctaveNoise(width, height, makeOctavePerlinNoiseFunction(octaves, initialFrequency, persistence));
};

export const makeOctavePerlinNoiseFunction = (octaves = 8, initialFrequency = 1, persistence = 0.5) => {
  return makeOctaveNoiseFunction(makePerlinNoiseFunction, octaves, initialFrequency, persistence);
};

export const makeOctaveSimplexNoise = (width, height, octaves = 8, initialFrequency = 1, persistence = 0.5) => {
  return plotOctaveNoise(width, height, makeOctaveSimplexNoiseFunction(octaves, initialFrequency, persistence));
};

export const makeOctaveSimplexNoiseFunction = (octaves = 8, initialFrequency = 1, persistence = 0.5) => {
  return makeOctaveNoiseFunction(makeSimplexNoiseFunction, octaves, initialFrequency, persistence);
};

const makeAttenuatedFunction = (func, factor) => {
  return (x, y) => factor * func(x, y);
};

const makeOctaveNoiseFunction = (noiseMaker, octaves = 8, initialFrequency = 1, persistence = 0.5) => {
  const noiseFuncs = new Array(octaves);
  let amplitude = 1;
  let frequency = initialFrequency;
  for (let i = 0; i < octaves; i++) {
    noiseFuncs.push(makeAttenuatedFunction(noiseMaker(frequency), amplitude));
    amplitude *= persistence;
    frequency *= 2;
  }
  return (x, y) => noiseFuncs.reduce((sum, f) => sum + f(x, y), 0);
};

const plotOctaveNoise = (width, height, noiseFunc) => {
  const buffer = new Float32Array(width * height * 4);
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    const intensity = noiseFunc(i / width, j / height);
    buffer[idx + 0] = intensity;
    buffer[idx + 1] = intensity;
    buffer[idx + 2] = intensity;
  });
  return normalizeBuffer(buffer, width, height);
};
