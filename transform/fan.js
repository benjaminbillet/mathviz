import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makeFan = (a, b) => {
  a = a == null ? randomScalar(0, 1) : a;
  b = b == null ? randomScalar(Math.PI, 2 * Math.PI) : b;
  const t = a * a * Math.PI;
  const halfT = t / 2;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const r = z.abs();
    if ((theta + b) % t > halfT) {
      return new Complex(r * Math.cos(theta - halfT), r * Math.sin(theta - halfT));
    }
    return new Complex(r * Math.cos(theta + halfT), r * Math.sin(theta + halfT));
  };
};
