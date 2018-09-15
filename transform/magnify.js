import Complex from 'complex.js';
import fs from 'fs';

export const makeMagnifyFunction = () => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    return new Complex(z.re / (1 - r2), z.im / (1 - r2));
  };
};

export const makeMagnify = (file) => {
  fs.appendFileSync(file, 'makeMagnifyFunction()\n');
  return makeMagnifyFunction();
};
