import { complex, argument, modulus } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeFan2Function = (x: number, y: number): Transform2D => {
  const p1 = Math.PI * x * x;
  const halfP1 = p1 / 2;
  const p2 = y;
  return (z) => {
    const theta = math.atan2(z.re, z.im);
    const t = theta + p2 - p1 * Math.trunc((theta + p2) / p1);

    const r = modulus(z);
    if (t > halfP1) {
      return complex(r * math.sin(theta - halfP1), r * math.cos(theta - halfP1));
    }
    return complex(r * math.sin(theta + halfP1), r * math.cos(theta + halfP1));
  };
};

export const makeFan2 = () => {
  const x = randomScalar(0.1, 2);
  const y = randomScalar(0.1, 2);
  console.log(`makeFan2Function(${x}, ${y})`);
  return makeFan2Function(x, y);
};
