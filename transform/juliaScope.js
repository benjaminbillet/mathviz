import { complex, modulus } from '../utils/complex';

import { randomInteger, randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeJuliaScopeFunction = (power, dist) => {
  const ratio = dist / power;
  return (z) => {
    const r = Math.pow(modulus(z), ratio);
    let t = -1;
    if (Math.random() < 0.5) {
      t = 1;
    }
    t = (t * math.atan2(z.re, z.im) + 2 * Math.PI * Math.trunc(power * Math.random())) / power;
    return complex(math.cos(t) * r, math.sin(t) * r);
  };
};

export const makeJuliaScope = () => {
  const power = randomInteger(5, 10);
  const dist = randomScalar(2, 4);
  console.log(`makeJuliaScopeFunction(${power}, ${dist})`);
  return makeJuliaScopeFunction(power, dist);
};
