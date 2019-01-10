import { complex, argument, modulus } from '../utils/complex';

import math from '../utils/math';

export const makeHyperbolicFunction = () => {
  return (z) => {
    const r = modulus(z);
    const theta = argument(z);
    return complex(math.sin(theta) / r, r * math.cos(theta));
  };
};

export const makeHyperbolic = () => {
  console.log('makeHyperbolicFunction()');
  return makeHyperbolicFunction();
};
