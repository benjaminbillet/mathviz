import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makeShrink = (a, b) => {
  a = a == null ? randomScalar(0.5, 1) : a;
  b = b == null ? randomScalar(2, 4) : b;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    let r = z.abs();
    r = Math.pow(r, b) / (b * a);
    return new Complex(r * Math.sin(theta), r * Math.cos(theta));
  };
};
