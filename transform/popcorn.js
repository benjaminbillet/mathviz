import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makePopCornFunction = (a, b) => {
  return (z) => new Complex(z.re + a * Math.sin(Math.tan(3 * z.im)), z.im + b * Math.sin(Math.tan(3 * z.re)));
};

export const makePopCorn = (file) => {
  const a = randomScalar(-1, 1);
  const b = randomScalar(-1, 1);
  fs.appendFileSync(file, `makePopCornFunction(${a}, ${b})\n`);
  return makePopCornFunction(a, b);
};
