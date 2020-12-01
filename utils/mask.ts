import { fillPicture, forEachPixel, normalizeBuffer } from './picture';
import { DistanceFunction2D } from './types';

export const whiteMask = (width: number, height: number) => {
  return uniformMask(1, width, height);
};

export const blackMask = (width: number, height: number) => {
  return uniformMask(0, width, height);
};

export const grayMask = (width: number, height: number) => {
  return uniformMask(0.5, width, height);
};

export const uniformMask = (intensity: number, width: number, height: number) => {
  return fillPicture(new Float32Array(width * height * 4), intensity, intensity, intensity, 1);
};

export const distanceCenterMask = (distanceFunc: DistanceFunction2D, width: number, height: number) => {
  const mask = new Float32Array(width * height * 4);
  forEachPixel(mask, width, height, (r, g, b, a, x, y, idx) => {
    const distance = distanceFunc(0, 0, x / width - 0.5, y / height - 0.5);
    mask[idx + 0] = distance;
    mask[idx + 1] = distance;
    mask[idx + 2] = distance;
    mask[idx + 3] = 1; // TODO alpha
  });
  normalizeBuffer(mask, width, height);
  return mask;
};
