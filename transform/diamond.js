import Complex from 'complex.js';
import fs from 'fs';
import math from '../utils/math';

export const makeDiamondFunction = () => {
  return (z) => {
    const r = z.abs();
    const theta = math.atan2(z.im, z.re);
    return new Complex(math.sin(theta) * math.cos(r), math.cos(theta) * math.sin(r));
  };
};

export const makeDiamond = (file) => {
  fs.appendFileSync(file, 'makeDiamondFunction()\n');
  return makeDiamondFunction();
};
