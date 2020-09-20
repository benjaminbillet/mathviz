import { complex } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeEpitrochoidFunction = (r: number, R: number, d: number): Transform2D => {
  const rPlusR = r + R;
  const rPlusROverR = (r + R) / r;
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const x = rPlusR * math.cos(theta) - d * math.cos(rPlusROverR * theta);
    const y = rPlusR * math.sin(theta) - d * math.sin(rPlusROverR * theta);

    const xSquared = (z.re * z.re) % 1; // modulo ensure that the cycloid doesn't overflow
    const ySquared = (z.im * z.im) % 1; // modulo ensure that the cycloid doesn't overflow
    const r2 = math.sqrt((xSquared * (1 - 0.5 * ySquared) + ySquared * (1 - 0.5 * xSquared)) * (x * x + y * y));
    const theta2 = math.atan2(y, x);

    return complex(r2 * math.cos(theta2), r2 * math.sin(theta2));
  };
};

export const makeEpitrochoid = () => {
  const r = randomScalar(0.1, 0.5);
  const R = randomScalar(0.1, 0.5);
  const d = randomScalar(0, 0.5);
  console.log(`makeEpitrochoidFunction(${r}, ${R}, ${d})`);
  return makeEpitrochoidFunction(r, R, d);
};
