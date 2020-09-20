import { complex, modulus, argument } from '../utils/complex';

import { randomScalar } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeShrinkFunction = (a: number, b: number): Transform2D => {
  return (z) => {
    const theta = argument(z);
    let r = modulus(z);
    r = Math.pow(r, b) / (b * a);
    return complex(r * Math.sin(theta), r * Math.cos(theta));
  };
};

export const makeShrink = () => {
  const a = randomScalar(0.5, 1);
  const b = randomScalar(2, 4);
  console.log(`makeShrinkFunction(${a}, ${b})`);
  return makeShrinkFunction(a, b);
};
