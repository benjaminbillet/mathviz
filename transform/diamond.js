import Complex from 'complex.js';
import fs from 'fs';

export const makeDiamondFunction = () => {
  return (z) => {
    const r = z.abs();
    const theta = Math.atan2(z.re, z.im);
    return new Complex(Math.sin(theta) * Math.cos(r), Math.cos(theta) * Math.sin(r));
  };
};

export const makeDiamond = (file) => {
  fs.appendFileSync(file, 'makeDiamondFunction()\n');
  return makeDiamondFunction();
};
