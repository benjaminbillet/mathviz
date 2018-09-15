import Complex from 'complex.js';
import fs from 'fs';

export const makeExFunction = () => {
  return (z) => {
    const r = z.abs();
    const theta = Math.atan2(z.re, z.im);
    const p0 = Math.sin(theta + r);
    const p1 = Math.cos(theta - r);
    return new Complex(r * (p0 * p0 * p0 + p1 * p1 * p1), r * (p0 * p0 * p0 - p1 * p1 * p1));
  };
};

export const makeEx = (file) => {
  fs.appendFileSync(file, 'makeExFunction()\n');
  return makeExFunction();
};
