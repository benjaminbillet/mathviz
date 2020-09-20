import { complex, argument, modulus } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeFanFunction = (a: number, b: number): Transform2D => {
  const t = a * a * Math.PI;
  const halfT = t / 2;
  return (z) => {
    const theta = argument(z);
    const r = modulus(z);
    if ((theta + b) % t > halfT) {
      return complex(r * math.cos(theta - halfT), r * math.sin(theta - halfT));
    }
    return complex(r * math.cos(theta + halfT), r * math.sin(theta + halfT));
  };
};

export const makeFan = () => {
  const a = randomScalar(0, 1);
  const b = randomScalar(Math.PI, 2 * Math.PI);
  console.log(`makeFanFunction(${a}, ${b})`);
  return makeFanFunction(a, b);
};
