import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makeCardioidFunction = (a) => {
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const xSquared = z.re * z.re;
    const ySquared = z.im * z.im;
    const cosTheta = Math.cos(theta);
    const r = Math.sqrt(xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) - a * (1 - cosTheta);
    return new Complex(r * cosTheta - a, r * Math.sin(theta));
  };
};

export const makeCardioid = (file) => {
  const a = randomScalar(0.5, 1);
  fs.appendFileSync(file, `makeCardioidFunction(${a})\n`);
  return makeCardioidFunction(a);
};
