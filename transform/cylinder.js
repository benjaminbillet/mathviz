import Complex from 'complex.js';
import fs from 'fs';
import math from '../utils/math';

export const makeCylinderFunction = () => {
  return (z) => new Complex(math.sin(z.re), z.im);
};

export const makeCylinder = (file) => {
  fs.appendFileSync(file, 'makeCylinderFunction()\n');
  return makeCylinderFunction();
};
