import { complex, modulus } from '../utils/complex';

import { randomScalar, random } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeTwintrianFunction = (a: number): Transform2D => {
  return (z) => {
    const r = modulus(z);
    const x = random() * r * a;
    const sinx = math.sin(x);
    const t = Math.log10(sinx * sinx) + math.cos(x);
    return complex(z.re * t, z.re * (t - Math.PI * sinx));
  };
};

export const makeTwintrian = () => {
  const a = randomScalar(0, Math.PI * 2);
  console.log(`makeTwintrianFunction(${a})`);
  return makeTwintrianFunction(a);
};
