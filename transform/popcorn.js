import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makePopCorn = (a, b) => {
  a = a == null ? randomScalar(-1, 1) : a;
  b = b == null ? randomScalar(-1, 1) : b;
  return (z) => new Complex(z.re + a * Math.sin(Math.tan(3 * z.im)), z.im + b * Math.sin(Math.tan(3 * z.re)));
};
