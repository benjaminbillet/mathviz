import { complex, modulus } from '../utils/complex';

import { randomInteger, randomScalar, binomial, random } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeJuliaScopeFunction = (power: number, dist: number): Transform2D => {
  const ratio = dist / power;
  return (z) => {
    const r = Math.pow(modulus(z), ratio);
    let t = -1;
    if (binomial() === 0) {
      t = 1;
    }
    t = (t * math.atan2(z.re, z.im) + 2 * Math.PI * Math.trunc(power * random())) / power;
    return complex(math.cos(t) * r, math.sin(t) * r);
  };
};

export const makeJuliaScope = () => {
  const power = randomInteger(5, 10);
  const dist = randomScalar(2, 4);
  console.log(`makeJuliaScopeFunction(${power}, ${dist})`);
  return makeJuliaScopeFunction(power, dist);
};
