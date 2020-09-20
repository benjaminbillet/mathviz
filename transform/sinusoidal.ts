
import math from '../utils/math';
import { complex } from '../utils/complex';
import { Transform2D } from '../utils/types';

export const makeSinusoidalFunction = (): Transform2D => {
  return (z) => complex(math.sin(z.re), math.sin(z.im));
};

export const makeSinusoidal = () => {
  console.log('makeSinusoidalFunction()');
  return makeSinusoidalFunction();
};
