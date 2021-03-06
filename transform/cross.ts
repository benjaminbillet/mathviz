import { mul } from '../utils/complex';
import { randomScalar } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeCrossFunction = (f: number): Transform2D => {
  return (z) => {
    const a = z.re * z.re - z.im * z.im;
    const b = Math.sqrt(1 / (a * a));
    return mul(z, b / f);
  };
};

export const makeCross = () => {
  const f = randomScalar(2, 5);
  console.log(`makeCrossFunction(${f})`);
  return makeCrossFunction(f);
};
