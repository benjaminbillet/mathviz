import Complex from 'complex.js';

import math from '../utils/math';

export const makeDiamondFunction = () => {
  return (z) => {
    const r = z.abs();
    const theta = math.atan2(z.im, z.re);
    return new Complex(math.sin(theta) * math.cos(r), math.cos(theta) * math.sin(r));
  };
};

export const makeDiamond = () => {
  console.log('makeDiamondFunction()');
  return makeDiamondFunction();
};
