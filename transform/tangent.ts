import { complex } from '../utils/complex';

import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeTangentFunction = (): Transform2D => {
  return (z) => complex(math.sin(z.re) / math.cos(z.im), math.tan(z.im));
};

export const makeTangent = () => {
  console.log('makeTangentFunction()');
  return makeTangentFunction();
};
