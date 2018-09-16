import Complex from 'complex.js';
import fs from 'fs';
import math from '../utils/math';

export const makeHyperbolicFunction = () => {
  return (z) => {
    const r = z.abs();
    const theta = math.atan2(z.im, z.re);
    return new Complex(math.sin(theta) / r, r * math.cos(theta));
  };
};

export const makeHyperbolic = (file) => {
  fs.appendFileSync(file, 'makeHyperbolicFunction()\n');
  return makeHyperbolicFunction();
};
