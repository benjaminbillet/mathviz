import Complex from 'complex.js';
import fs from 'fs';
import math from '../utils/math';

export const makeSpiralFunction = () => {
  return (z) => {
    const r = z.abs();
    const theta = math.atan2(z.im, z.re);
    return new Complex((math.cos(theta) + math.sin(r)) / r, (math.sin(theta) - math.cos(r)) / r);
  };
};

export const makeSpiral = (file) => {
  fs.appendFileSync(file, 'makeSpiralFunction()\n');
  return makeSpiralFunction();
};
