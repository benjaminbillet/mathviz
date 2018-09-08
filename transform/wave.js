import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makeWave = (a, b, c, d) => {
  a = a == null ? randomScalar(0, 1) : a;
  b = b == null ? randomScalar(0.01, 1) : b;
  c = c == null ? randomScalar(0, 1) : c;
  d = d == null ? randomScalar(0.01, 1) : d;
  const bSquared = b * b;
  const dSquared = d * d;
  return (z) => new Complex(z.re + a * Math.sin(z.im / bSquared), z.im + c * Math.sin(z.re / dSquared));
};
