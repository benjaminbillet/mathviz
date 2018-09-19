import Complex from 'complex.js';

import math from '../utils/math';

export const makeCosineFunction = () => {
  return (z) => {
    const xPi = z.re * Math.PI;
    return new Complex(math.cos(xPi) * Math.cosh(z.im), - math.sin(xPi) * Math.sinh(z.im));
  };
};

export const makeCosine = () => {
  console.log('makeCosineFunction()');
  return makeCosineFunction();
};
