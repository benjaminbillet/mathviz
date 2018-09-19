import Complex from 'complex.js';

import { randomInteger } from '../utils/random';
import math from '../utils/math';

export const makeEpicycloidFunction = (k) => {
  k = k + 1;
  const r = 1 / k;
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const cosTheta = math.cos(theta);
    const sinTheta = math.sin(theta);
    const x = r * (k * cosTheta - math.cos(k * theta));
    const y = r * (k * sinTheta - math.sin(k * theta));

    const xSquared = z.re * z.re;
    const ySquared = z.im * z.im;
    const r2 = math.sqrt((xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) * (x * x + y * y));
    const theta2 = math.atan2(y, x);

    return new Complex(r2 * math.cos(theta2), r2 * math.sin(theta2));
  };
};

export const makeEpicycloid = () => {
  const k = randomInteger(2, 20);
  console.log(`makeEpicycloidFunction(${k})`);
  return makeEpicycloidFunction(k);
};
