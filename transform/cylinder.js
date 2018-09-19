import Complex from 'complex.js';

import math from '../utils/math';

export const makeCylinderFunction = () => {
  return (z) => new Complex(math.sin(z.re), z.im);
};

export const makeCylinder = () => {
  console.log('makeCylinderFunction()');
  return makeCylinderFunction();
};
