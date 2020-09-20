import { complex } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeCardioidFunction = (a: number): Transform2D => {
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const xSquared = (z.re * z.re) % 1; // modulo ensure that the cycloid doesn't overflow
    const ySquared = (z.im * z.im) % 1; // modulo ensure that the cycloid doesn't overflow
    const cosTheta = math.cos(theta);
    const r = math.sqrt(xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) - a * (1 - cosTheta);
    return complex(r * cosTheta - a, r * math.sin(theta));
  };
};

export const makeCardioid = () => {
  const a = randomScalar(0.5, 1);
  console.log(`makeCardioidFunction(${a})`);
  return makeCardioidFunction(a);
};
