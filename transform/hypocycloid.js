import { complex } from '../utils/complex';

import { randomInteger } from '../utils/random';
import math from '../utils/math';

export const makeHypocycloidFunction = (k) => {
  const r = 1 / k;
  k = k - 1;
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const cosTheta = math.cos(theta);
    const sinTheta = math.sin(theta);
    const x = r * (k * cosTheta + math.cos(k * theta));
    const y = r * (k * sinTheta - math.sin(k * theta));

    const xSquared = (z.re * z.re) % 1; // modulo ensure that the cycloid doesn't overflow
    const ySquared = (z.im * z.im) % 1; // modulo ensure that the cycloid doesn't overflow
    const r2 = math.sqrt((xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) * (x * x + y * y));
    const theta2 = math.atan2(y, x);

    return complex(r2 * math.cos(theta2), r2 * math.sin(theta2));
  };
};

export const makeHypocycloid = () => {
  const k = randomInteger(2, 20);
  console.log(`makeHypocycloidFunction(${k})`);
  return makeHypocycloidFunction(k);
};
