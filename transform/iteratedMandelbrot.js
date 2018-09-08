import Complex from 'complex.js';
import { randomInteger } from '../utils/random';

export const makeIteratedMandelbrot = (d, n) => {
  d = d == null ? randomInteger(2, 5) : d;
  n = n == null ? randomInteger(2, 10) : n;
  return (z) => {
    let zn = new Complex(0, 0);
    for (let i = 0; i < n; i++) {
      zn = zn.pow(d).add(z);
    }
    return zn;
  }
};
