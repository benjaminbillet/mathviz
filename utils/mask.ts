import { forEachPixel, normalizeBuffer } from './picture';
import { DistanceFunction2D } from './types';

export const whiteMask = (width: number, height: number, channels = 4) => {
  return uniformMask(1, width, height, channels);
};

export const blackMask = (width: number, height: number, channels = 4) => {
  return uniformMask(0, width, height, channels);
};

export const grayMask = (width: number, height: number, channels = 4) => {
  return uniformMask(0.5, width, height, channels);
};

export const uniformMask = (intensity: number, width: number, height: number, channels = 4) => {
  return new Float32Array(width * height * channels).fill(intensity);
};

export const distanceCenterMask = (distanceFunc: DistanceFunction2D, width: number, height: number, channels = 4) => {
  const mask = new Float32Array(width * height * channels);
  forEachPixel(mask, width, height, (r, g, b, a, x, y, idx) => {
    const distance = distanceFunc(0, 0, x / width - 0.5, y / height - 0.5);
    for (let i = 0; i < channels; i++) {
      mask[idx + i] = distance;
    }
  });
  normalizeBuffer(mask, width, height);
  return mask;
};
