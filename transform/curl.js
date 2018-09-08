import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makeCurl = (a, b) => {
  a = a == null ? randomScalar(-1, 1) : a;
  b = b == null ? randomScalar(-1, 1) : b;

  const twoB = b * 2;
  return (z) => {
    const t1 = 1 + a * z.re + b * (z.re * z.re - z.im * z.im);
    const t2 = a * z.im + twoB * z.re * z.im;
    const factor = 1 / (t1 * t1 + t2 * t2);
    return new Complex(factor * (t1 * z.re + t2 * z.im), factor * (t1 * z.im - t2 * z.re));
  };
};
