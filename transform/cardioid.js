import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makeCardioid = (a) => {
  a = a == null ? randomScalar(0.5, 1) : a;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const xSquared = z.re * z.re;
    const ySquared = z.im * z.im;
    const cosTheta = Math.cos(theta);
    const r = Math.sqrt(xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) - a * (1 - cosTheta);
    return new Complex(r * cosTheta - a, r * Math.sin(theta));
  };
};
