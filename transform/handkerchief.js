import { complex, modulus, argument } from '../utils/complex';

import math from '../utils/math';

export const makeHandkerchiefFunction = () => {
  return (z) => {
    const theta = argument(z);
    const r = modulus(z);
    return complex(math.sin(theta + r) * r, math.cos(theta - r) * r);
  };
};

export const makeHandkerchief = () => {
  console.log('makeHandkerchiefFunction()');
  return makeHandkerchiefFunction();
};
