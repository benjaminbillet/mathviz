import { complex } from '../utils/complex';

import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeCosineFunction = (): Transform2D => {
  return (z) => {
    const xPi = z.re * Math.PI;
    return complex(math.cos(xPi) * Math.cosh(z.im), - math.sin(xPi) * Math.sinh(z.im));
  };
};

export const makeCosine = () => {
  console.log('makeCosineFunction()');
  return makeCosineFunction();
};
