import { complex } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeSwirlFunction = (freq, phase) => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    const sinr2 = math.sin(r2 * freq + phase);
    const cosr2 = math.cos(r2 * freq + phase);
    return complex(z.re * sinr2 - z.im * cosr2, z.re * cosr2 + z.im * sinr2);
  };
};

export const makeSwirl = () => {
  const freq = randomScalar(0.5, 2);
  const phase = randomScalar(0, 2 * Math.PI);

  console.log(`makeSwirlFunction(${freq},${phase})`);
  return makeSwirlFunction(freq, phase);
};
