import { complex, modulus, argument } from '../utils/complex';

import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeSpiralFunction = (): Transform2D => {
  return (z) => {
    const r = modulus(z);
    const theta = argument(z);
    return complex((math.cos(theta) + math.sin(r)) / r, (math.sin(theta) - math.cos(r)) / r);
  };
};

export const makeSpiral = () => {
  console.log('makeSpiralFunction()');
  return makeSpiralFunction();
};
