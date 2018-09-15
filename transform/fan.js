import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makeFanFunction = (a, b) => {
  const t = a * a * Math.PI;
  const halfT = t / 2;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const r = z.abs();
    if ((theta + b) % t > halfT) {
      return new Complex(r * Math.cos(theta - halfT), r * Math.sin(theta - halfT));
    }
    return new Complex(r * Math.cos(theta + halfT), r * Math.sin(theta + halfT));
  };
};

export const makeFan = (file) => {
  const a = randomScalar(0, 1);
  const b = randomScalar(Math.PI, 2 * Math.PI);
  fs.appendFileSync(file, `makeFanFunction(${a}, ${b})\n`);
  return makeFanFunction(a, b);
};
