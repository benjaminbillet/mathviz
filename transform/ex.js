import { complex, argument, modulus } from '../utils/complex';

import math from '../utils/math';

export const makeExFunction = () => {
  return (z) => {
    const r = modulus(z);
    const theta = argument(z);
    const p0 = math.sin(theta + r);
    const p1 = math.cos(theta - r);
    return complex(r * (p0 * p0 * p0 + p1 * p1 * p1), r * (p0 * p0 * p0 - p1 * p1 * p1));
  };
};

export const makeEx = () => {
  console.log('makeExFunction()');
  return makeExFunction();
};
