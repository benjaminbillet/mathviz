import Complex from 'complex.js';
import fs from 'fs';
import math from '../utils/math';

export const makeExFunction = () => {
  return (z) => {
    const r = z.abs();
    const theta = math.atan2(z.im, z.re);
    const p0 = math.sin(theta + r);
    const p1 = math.cos(theta - r);
    return new Complex(r * (p0 * p0 * p0 + p1 * p1 * p1), r * (p0 * p0 * p0 - p1 * p1 * p1));
  };
};

export const makeEx = (file) => {
  fs.appendFileSync(file, 'makeExFunction()\n');
  return makeExFunction();
};
