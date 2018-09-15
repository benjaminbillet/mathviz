import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makeShrinkFunction = (a, b) => {
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    let r = z.abs();
    r = Math.pow(r, b) / (b * a);
    return new Complex(r * Math.sin(theta), r * Math.cos(theta));
  };
};

export const makeShrink = (file) => {
  const a = randomScalar(0.5, 1);
  const b = randomScalar(2, 4);
  fs.appendFileSync(file, `makeShrinkFunction(${a}, ${b})\n`);
  return makeShrinkFunction(a, b);
};
