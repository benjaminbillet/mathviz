import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makeCurlFunction = (a, b) => {
  const twoB = b * 2;
  return (z) => {
    const t1 = 1 + a * z.re + b * (z.re * z.re - z.im * z.im);
    const t2 = a * z.im + twoB * z.re * z.im;
    const factor = 1 / (t1 * t1 + t2 * t2);
    return new Complex(factor * (t1 * z.re + t2 * z.im), factor * (t1 * z.im - t2 * z.re));
  };
};

export const makeCurl = (file) => {
  const a = randomScalar(-1, 1);
  const b = randomScalar(-1, 1);
  fs.appendFileSync(file, `makeCurlFunction(${a}, ${b})\n`);
  return makeCurlFunction(a, b);
};
