import Complex from 'complex.js';

import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeCircleFunction = (r) => {
  const halfR = r / 2;
  return (z) => new Complex(z.re * math.sqrt(r - halfR * z.im * z.im), z.im * math.sqrt(r - halfR * z.re * z.re));
};

export const makeCircle = () => {
  const r = randomScalar(0.5, 1.5);
  console.log(`makeCircleFunction(${r})`);
  return makeCircleFunction(r);
};
