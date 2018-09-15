import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makeBlobFunction = (high, low, waves) => {
  const halfDistance = (high - low) / 2;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const factor = z.abs() * (low + halfDistance * (Math.sin(waves * theta) + 1));
    return new Complex(factor * Math.cos(theta), factor * Math.sin(theta));
  };
};

export const makeBlob = (file) => {
  const high = randomScalar(-1, 1);
  const low = randomScalar(-1, 1);
  const waves = randomScalar(-1, 1);

  fs.appendFileSync(file, `makeBlobFunction(${high}, ${low}, ${waves})\n`);
  return makeBlobFunction(high, low, waves);
};
