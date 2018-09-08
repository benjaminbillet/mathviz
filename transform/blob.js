import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makeBlob = (high, low, waves) => {
  high = high == null ? randomScalar(-1, 1) : high;
  low = low == null ? randomScalar(-1, 1) : low;
  waves = waves == null ? randomScalar(-1, 1) : waves;

  const halfDistance = (high - low) / 2;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const factor = z.abs() * (low + halfDistance * (Math.sin(waves * theta) + 1));
    return new Complex(factor * Math.cos(theta), factor * Math.sin(theta));
  };
};
