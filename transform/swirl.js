import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makeSwirlFunction = (offset) => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    const sinr2 = Math.sin(r2 + offset);
    const cosr2 = Math.cos(r2 + offset);
    return new Complex(z.re * sinr2 - z.im * cosr2, z.re * cosr2 + z.im * sinr2);
  };
};

export const makeSwirl = (file) => {
  const offset = randomScalar(0, 2 * Math.PI);
  fs.appendFileSync(file, `makeSwirlFunction(${offset})\n`);
  return makeSwirlFunction(offset);
};
