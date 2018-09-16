import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeFanFunction = (a, b) => {
  const t = a * a * Math.PI;
  const halfT = t / 2;
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const r = z.abs();
    if ((theta + b) % t > halfT) {
      return new Complex(r * math.cos(theta - halfT), r * math.sin(theta - halfT));
    }
    return new Complex(r * math.cos(theta + halfT), r * math.sin(theta + halfT));
  };
};

export const makeFan = (file) => {
  const a = randomScalar(0, 1);
  const b = randomScalar(Math.PI, 2 * Math.PI);
  fs.appendFileSync(file, `makeFanFunction(${a}, ${b})\n`);
  return makeFanFunction(a, b);
};
