import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeCardioidFunction = (a) => {
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const xSquared = z.re * z.re;
    const ySquared = z.im * z.im;
    const cosTheta = math.cos(theta);
    const r = math.sqrt(xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) - a * (1 - cosTheta);
    return new Complex(r * cosTheta - a, r * math.sin(theta));
  };
};

export const makeCardioid = (file) => {
  const a = randomScalar(0.5, 1);
  fs.appendFileSync(file, `makeCardioidFunction(${a})\n`);
  return makeCardioidFunction(a);
};
