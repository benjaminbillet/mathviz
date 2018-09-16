import Complex from 'complex.js';
import fs from 'fs';
import { randomInteger } from '../utils/random';
import math from '../utils/math';

export const makeIteratedMandelbrotFunction = (d, n) => {
  const halfD = d / 2;
  return (z) => {
    let znRe = 0;
    let znIm = 0;
    for (let i = 0; i < n; i++) {
      // zn = zn.pow(d).add(z);
      const theta = math.atan2(znIm, znRe) * d;
      const loh = Math.exp(Math.log(znRe * znRe + znIm * znIm) * halfD);
      znRe = loh * math.cos(theta) + z.re;
      znIm = loh * math.sin(theta) + z.im;
    }
    return new Complex(znRe, znIm);
  };
};

export const makeIteratedMandelbrot = (file) => {
  const d = randomInteger(2, 5);
  const n = randomInteger(2, 10);
  fs.appendFileSync(file, `makeIteratedMandelbrotFunction(${d}, ${n})\n`);
  return makeIteratedMandelbrotFunction(d, n);
};
