import { complex, modulus } from '../utils/complex';

import { randomScalar, random } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeBladeFunction = (a: number): Transform2D => {
  return (z) => {
    const r = modulus(z);
    const x = random() * r * a;
    const sinx = math.sin(x);
    const cosx = math.cos(x);
    return complex(z.re * (cosx + sinx), z.re * (cosx - sinx));
  };
};

export const makeBlade = () => {
  const a = randomScalar(0, Math.PI * 2);
  console.log(`makeBladeFunction(${a})`);
  return makeBladeFunction(a);
};
