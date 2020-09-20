import { complex, modulus, argument } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeBlobFunction = (high: number, low: number, waves: number): Transform2D => {
  const halfDistance = (high - low) / 2;
  return (z) => {
    const theta = argument(z);
    const factor = modulus(z) * (low + halfDistance * (math.sin(waves * theta) + 1));
    return complex(factor * math.cos(theta), factor * math.sin(theta));
  };
};

export const makeBlob = () => {
  const high = randomScalar(-1, 1);
  const low = randomScalar(-1, 1);
  const waves = randomScalar(-1, 1);

  console.log(`makeBlobFunction(${high}, ${low}, ${waves})`);
  return makeBlobFunction(high, low, waves);
};
