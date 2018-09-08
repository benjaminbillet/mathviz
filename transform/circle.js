import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makeCircle = (r) => {
  r = r == null ? randomScalar(0.5, 1.5) : r;
  const halfR = r / 2;
  return (z) => new Complex(z.re * Math.sqrt(r - halfR * z.im * z.im), z.im * Math.sqrt(r - halfR * z.re * z.re));
};
