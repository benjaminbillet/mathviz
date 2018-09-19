import Complex from 'complex.js';

import math from '../utils/math';

export const makeHandkerchiefFunction = () => {
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const r = z.abs();
    return new Complex(math.sin(theta + r) * r, math.cos(theta - r) * r);
  };
};

export const makeHandkerchief = () => {
  console.log('makeHandkerchiefFunction()');
  return makeHandkerchiefFunction();
};
