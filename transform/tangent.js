import { complex } from '../utils/complex';

import math from '../utils/math';

export const makeTangentFunction = () => {
  return (z) => complex(math.sin(z.re) / math.cos(z.im), math.tan(z.im));
};

export const makeTangent = () => {
  console.log('makeTangentFunction()');
  return makeTangentFunction();
};
