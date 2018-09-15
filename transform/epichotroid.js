import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makeEpitrochoidFunction = (r, R, d) => {
  const rPlusR = r + R;
  const rPlusROverR = (r + R) / r;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const x = rPlusR * Math.cos(theta) - d * Math.cos(rPlusROverR * theta);
    const y = rPlusR * Math.sin(theta) - d * Math.sin(rPlusROverR * theta);

    const xSquared = z.re * z.re;
    const ySquared = z.im * z.im;
    const r2 = Math.sqrt((xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) * (x * x + y * y));
    const theta2 = Math.atan2(x, y);

    return new Complex(r2 * Math.cos(theta2), r2 * Math.sin(theta2));
  };
};

export const makeEpitrochoid = (file) => {
  const r = randomScalar(0.1, 0.5);
  const R = randomScalar(0.1, 1);
  const d = randomScalar(0, 0.5);
  fs.appendFileSync(file, `makeEpitrochoidFunction(${r}, ${R}, ${d})\n`);
  return makeEpitrochoidFunction(r, R, d);
};
