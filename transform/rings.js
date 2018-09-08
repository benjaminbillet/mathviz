import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makeRings = (a) => {
  a = a == null ? randomScalar(-1, 1) : a;
  const aSquared = a * a;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const r = z.abs();
    const factor = ((r + aSquared) % (2 * aSquared)) - aSquared + (r * (1 - aSquared));
    return new Complex(factor * Math.cos(theta), factor * Math.sin(theta));
  };
};
