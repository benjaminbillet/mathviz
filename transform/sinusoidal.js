
import math from '../utils/math';
import { complex } from '../utils/complex';

export const makeSinusoidalFunction = () => {
  return (z) => complex(math.sin(z.re), math.sin(z.im));
};

export const makeSinusoidal = () => {
  console.log('makeSinusoidalFunction()');
  return makeSinusoidalFunction();
};
