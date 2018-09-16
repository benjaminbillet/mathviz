import Complex from 'complex.js';
import fs from 'fs';
import math from '../utils/math';

export const makeCosineFunction = () => {
  return (z) => {
    const xPi = z.re * Math.PI;
    return new Complex(math.cos(xPi) * Math.cosh(z.im), - math.sin(xPi) * Math.sinh(z.im));
  };
};

export const makeCosine = (file) => {
  fs.appendFileSync(file, 'makeCosineFunction()\n');
  return makeCosineFunction();
};
