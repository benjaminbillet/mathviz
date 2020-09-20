import { complex } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeCircleFunction = (r: number): Transform2D => {
  const halfR = r / 2;
  return (z) => complex(z.re * math.sqrt(r - halfR * z.im * z.im), z.im * math.sqrt(r - halfR * z.re * z.re));
};

export const makeCircle = () => {
  const r = randomScalar(0.5, 1.5);
  console.log(`makeCircleFunction(${r})`);
  return makeCircleFunction(r);
};
