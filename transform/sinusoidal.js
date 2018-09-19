import Complex from 'complex.js';

import math from '../utils/math';


export const makeSinusoidalFunction = () => {
  return (z) => new Complex(math.sin(z.re), math.sin(z.im));
};

export const makeSinusoidal = () => {
  console.log('makeSinusoidalFunction()');
  return makeSinusoidalFunction();
};
