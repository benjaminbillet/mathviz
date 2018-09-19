import Complex from 'complex.js';

import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makePopCornFunction = (a, b) => {
  return (z) => new Complex(z.re + a * math.sin(math.tan(3 * z.im)), z.im + b * math.sin(math.tan(3 * z.re)));
};

export const makePopCorn = () => {
  const a = randomScalar(-1, 1);
  const b = randomScalar(-1, 1);
  console.log(`makePopCornFunction(${a}, ${b})`);
  return makePopCornFunction(a, b);
};
