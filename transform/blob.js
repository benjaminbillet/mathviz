import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeBlobFunction = (high, low, waves) => {
  const halfDistance = (high - low) / 2;
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const factor = z.abs() * (low + halfDistance * (math.sin(waves * theta) + 1));
    return new Complex(factor * math.cos(theta), factor * math.sin(theta));
  };
};

export const makeBlob = (file) => {
  const high = randomScalar(-1, 1);
  const low = randomScalar(-1, 1);
  const waves = randomScalar(-1, 1);

  fs.appendFileSync(file, `makeBlobFunction(${high}, ${low}, ${waves})\n`);
  return makeBlobFunction(high, low, waves);
};
