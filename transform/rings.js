import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeRingsFunction = (a) => {
  const aSquared = a * a;
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const r = z.abs();
    const factor = ((r + aSquared) % (2 * aSquared)) - aSquared + (r * (1 - aSquared));
    return new Complex(factor * math.cos(theta), factor * math.sin(theta));
  };
};

export const makeRings = (file) => {
  const a = randomScalar(-1, 1);
  fs.appendFileSync(file, `makeRingsFunction(${a})\n`);
  return makeRingsFunction(a);
};
