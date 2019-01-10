import { complex } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeSwirlFunction = (offset) => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    const sinr2 = math.sin(r2 + offset);
    const cosr2 = math.cos(r2 + offset);
    return complex(z.re * sinr2 - z.im * cosr2, z.re * cosr2 + z.im * sinr2);
  };
};

export const makeSwirl = () => {
  const offset = randomScalar(0, 2 * Math.PI);
  console.log(`makeSwirlFunction(${offset})`);
  return makeSwirlFunction(offset);
};
