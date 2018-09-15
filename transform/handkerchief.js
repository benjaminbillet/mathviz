import Complex from 'complex.js';
import fs from 'fs';

export const makeHandkerchiefFunction = () => {
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const r = z.abs();
    return new Complex(Math.sin(theta + r) * r, Math.cos(theta - r) * r);
  };
};

export const makeHandkerchief = (file) => {
  fs.appendFileSync(file, 'makeHandkerchiefFunction()\n');
  return makeHandkerchiefFunction();
};
