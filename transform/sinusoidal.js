import Complex from 'complex.js';
import fs from 'fs';
import math from '../utils/math';


export const makeSinusoidalFunction = () => {
  return (z) => new Complex(math.sin(z.re), math.sin(z.im));
};

export const makeSinusoidal = (file) => {
  fs.appendFileSync(file, 'makeSinusoidalFunction()\n');
  return makeSinusoidalFunction();
};
