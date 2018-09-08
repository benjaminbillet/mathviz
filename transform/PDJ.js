import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makePDJ = (a, b, c, d) => {
  a = a == null ? randomScalar(0, 2 * Math.PI) : a;
  b = b == null ? randomScalar(0, 2 * Math.PI) : b;
  c = c == null ? randomScalar(0, 2 * Math.PI) : c;
  d = d == null ? randomScalar(0, 2 * Math.PI) : d;
  return (z) => new Complex(Math.sin(a * z.im) - Math.cos(b * z.re), Math.sin(c * z.re) - Math.cos(d * z.im));
};
