import Complex from 'complex.js';
import fs from 'fs';
import math from '../utils/math';

export const makeTangentFunction = () => {
  return (z) => new Complex(math.sin(z.re) / math.cos(z.im), math.tan(z.im));
};

export const makeTangent = (file) => {
  fs.appendFileSync(file, 'makeTangentFunction()\n');
  return makeTangentFunction();
};
