import Complex from 'complex.js';
import fs from 'fs';
import math from '../utils/math';

export const makePolarFunction = () => {
  return (z) => new Complex(math.atan2(z.im, z.re) / Math.PI, z.abs() - 1);
};

export const makePolar = (file) => {
  fs.appendFileSync(file, 'makePolarFunction()\n');
  return makePolarFunction();
};
