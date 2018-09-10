import Complex from 'complex.js';
import { randomScalar, randomInteger } from '../utils/random';

export const makeHypocycloid = (r, k) => {
  r = r == null ? randomScalar(0.1, 0.5) : r;
  k = k == null ? randomInteger(2, 10) : k;
  k = k - 1;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const x = r * (k * cosTheta + Math.cos(k * theta));
    const y = r * (k * sinTheta - Math.sin(k * theta));

    const xSquared = z.re * z.re;
    const ySquared = z.im * z.im;
    const r2 = Math.sqrt((xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) * (x * x + y * y));
    const theta2 = Math.atan2(x, y);

    return new Complex(r2 * Math.cos(theta2), r2 * Math.sin(theta2));
  };
};