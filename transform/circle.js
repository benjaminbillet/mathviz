import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeCircleFunction = (r) => {
  const halfR = r / 2;
  return (z) => new Complex(z.re * math.sqrt(r - halfR * z.im * z.im), z.im * math.sqrt(r - halfR * z.re * z.re));
};

export const makeCircle = (file) => {
  const r = randomScalar(0.5, 1.5);
  fs.appendFileSync(file, `makeCircleFunction(${r})\n`);
  return makeCircleFunction(r);
};
