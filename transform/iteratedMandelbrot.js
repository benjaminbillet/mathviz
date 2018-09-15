import Complex from 'complex.js';
import fs from 'fs';
import { randomInteger } from '../utils/random';

export const makeIteratedMandelbrotFunction = (d, n) => {
  return (z) => {
    let znRe = 0;
    let znIm = 0;
    for (let i = 0; i < n; i++) {
      znRe = (znRe * znRe - znIm * znIm) + z.re;
      znIm = (2 * znRe * znIm) + z.im;
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
