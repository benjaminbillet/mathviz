import Complex from 'complex.js';

import math from '../utils/math';

export const makeTangentFunction = () => {
  return (z) => new Complex(math.sin(z.re) / math.cos(z.im), math.tan(z.im));
};

export const makeTangent = () => {
  console.log('makeTangentFunction()');
  return makeTangentFunction();
};
