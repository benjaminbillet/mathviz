import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeEpitrochoidFunction = (r, R, d) => {
  const rPlusR = r + R;
  const rPlusROverR = (r + R) / r;
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const x = rPlusR * math.cos(theta) - d * math.cos(rPlusROverR * theta);
    const y = rPlusR * math.sin(theta) - d * math.sin(rPlusROverR * theta);

    const xSquared = z.re * z.re;
    const ySquared = z.im * z.im;
    const r2 = math.sqrt((xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) * (x * x + y * y));
    const theta2 = math.atan2(y, x);

    return new Complex(r2 * math.cos(theta2), r2 * math.sin(theta2));
  };
};

export const makeEpitrochoid = (file) => {
  const r = randomScalar(0.1, 0.5);
  const R = randomScalar(0.1, 0.5);
  const d = randomScalar(0, 0.5);
  fs.appendFileSync(file, `makeEpitrochoidFunction(${r}, ${R}, ${d})\n`);
  return makeEpitrochoidFunction(r, R, d);
};
