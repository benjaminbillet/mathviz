import Complex from 'complex.js';
import fs from 'fs';

export const makeHyperbolicFunction = () => {
  return (z) => {
    const r = z.abs();
    const theta = Math.atan2(z.re, z.im);
    return new Complex(Math.sin(theta) / r, r * Math.cos(theta));
  };
};

export const makeHyperbolic = (file) => {
  fs.appendFileSync(file, 'makeHyperbolicFunction()\n');
  return makeHyperbolicFunction();
};
