import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makePopCornFunction = (a, b) => {
  return (z) => new Complex(z.re + a * math.sin(math.tan(3 * z.im)), z.im + b * math.sin(math.tan(3 * z.re)));
};

export const makePopCorn = (file) => {
  const a = randomScalar(-1, 1);
  const b = randomScalar(-1, 1);
  fs.appendFileSync(file, `makePopCornFunction(${a}, ${b})\n`);
  return makePopCornFunction(a, b);
};
