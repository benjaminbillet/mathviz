import Complex from 'complex.js';
import fs from 'fs';

export const makePolarFunction = () => {
  return (z) => new Complex(Math.atan2(z.re, z.im) / Math.PI, z.abs() - 1);
};

export const makePolar = (file) => {
  fs.appendFileSync(file, 'makePolarFunction()\n');
  return makePolarFunction();
};
