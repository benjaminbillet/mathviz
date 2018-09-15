import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makeWaveFunction = (a, b, c, d) => {
  const bSquared = b * b;
  const dSquared = d * d;
  return (z) => new Complex(z.re + a * Math.sin(z.im / bSquared), z.im + c * Math.sin(z.re / dSquared));
};

export const makeWave = (file) => {
  const a = randomScalar(0, 1);
  const b = randomScalar(0.01, 1);
  const c = randomScalar(0, 1);
  const d = randomScalar(0.01, 1);
  fs.appendFileSync(file, `makeWaveFunction(${a}, ${b}, ${c}, ${d})\n`);
  return makeWaveFunction(a, b, c, d);
};
