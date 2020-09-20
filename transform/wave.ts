import { complex } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeWaveFunction = (a: number, b: number, c: number, d: number): Transform2D => {
  const bSquared = b * b;
  const dSquared = d * d;
  return (z) => complex(z.re + a * math.sin(z.im / bSquared), z.im + c * math.sin(z.re / dSquared));
};

export const makeWave = () => {
  const a = randomScalar(0, 1);
  const b = randomScalar(0.01, 1);
  const c = randomScalar(0, 1);
  const d = randomScalar(0.01, 1);
  console.log(`makeWaveFunction(${a}, ${b}, ${c}, ${d})`);
  return makeWaveFunction(a, b, c, d);
};
