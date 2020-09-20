import { complex } from '../utils/complex';

import { randomScalar } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeCurlFunction = (a: number, b: number): Transform2D => {
  const twoB = b * 2;
  return (z) => {
    const t1 = 1 + a * z.re + b * (z.re * z.re - z.im * z.im);
    const t2 = a * z.im + twoB * z.re * z.im;
    const factor = 1 / (t1 * t1 + t2 * t2);
    return complex(factor * (t1 * z.re + t2 * z.im), factor * (t1 * z.im - t2 * z.re));
  };
};

export const makeCurl = () => {
  const a = randomScalar(-1, 1);
  const b = randomScalar(-1, 1);
  console.log(`makeCurlFunction(${a}, ${b})`);
  return makeCurlFunction(a, b);
};
