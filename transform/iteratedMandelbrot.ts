import { complex, powN, add } from '../utils/complex';

import { randomInteger } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeIteratedMandelbrotFunction = (d: number, n: number): Transform2D => {
  return (z) => {
    const zn = complex(z.re, z.im);
    for (let i = 0; i < n; i++) {
      powN(zn, d, zn);
      add(zn, z, zn);
    }
    return zn;
  };
};

export const makeIteratedMandelbrot = () => {
  const d = randomInteger(2, 5);
  const n = randomInteger(2, 10);
  console.log(`makeIteratedMandelbrotFunction(${d}, ${n})`);
  return makeIteratedMandelbrotFunction(d, n);
};
