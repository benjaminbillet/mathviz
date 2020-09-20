import { complex } from '../utils/complex';
import { Affine2D } from '../utils/types';
import { makeIfs } from './build';

export const TWONDRAGON_DOMAIN = { xmin: -3, xmax: 3, ymin: -3, ymax: 3 };

export const makeTwondragon = (size: number) => {
  const r = Math.sqrt(1.25 * size);

  const functions: Affine2D[] = new Array(size).fill(null).map((_, i) => {
    const a = Math.cos(2 * Math.PI * i / size);
    const b = Math.sin(2 * Math.PI * i / size);
    return (z) => {
      const ra = Math.sqrt(3 * (z.re * z.re + z.im * z.im));
      return complex(-z.re / r + z.im / (ra * r) + a, -z.re / (ra * r) - z.im / r + b);
    };
  });

  return makeIfs(functions, functions.map(() => 1 / size));
};
