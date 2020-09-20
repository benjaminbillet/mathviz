import { complex, squaredModulus } from '../utils/complex';
import { randomScalar, random } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeRaysFunction = (a: number): Transform2D => {
  return (z) => {
    const k = a * Math.tan(random() * Math.PI * a) / squaredModulus(z);
    return complex(math.cos(z.re) * k, math.sin(z.im) * k);
  };
};

export const makeRays = () => {
  const a = randomScalar(0, Math.PI * 2);
  console.log(`makeRaysFunction(${a})`);
  return makeRaysFunction(a);
};
