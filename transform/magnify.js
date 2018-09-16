import Complex from 'complex.js';
import fs from 'fs';

export const makeMagnifyFunction = () => {
  return (z) => {
    const oneMinusRSquared = 1 - (z.re * z.re + z.im * z.im);
    return new Complex(z.re / oneMinusRSquared, z.im / oneMinusRSquared);
  };
};

export const makeMagnify = (file) => {
  fs.appendFileSync(file, 'makeMagnifyFunction()\n');
  return makeMagnifyFunction();
};
