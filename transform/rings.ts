import { complex, argument, modulus } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeRingsFunction = (a: number): Transform2D => {
  const aSquared = a * a;
  return (z) => {
    const theta = argument(z);
    const r = modulus(z);
    const factor = ((r + aSquared) % (2 * aSquared)) - aSquared + (r * (1 - aSquared));
    return complex(factor * math.cos(theta), factor * math.sin(theta));
  };
};

export const makeRings = () => {
  const a = randomScalar(-1, 1);
  console.log(`makeRingsFunction(${a})`);
  return makeRingsFunction(a);
};
