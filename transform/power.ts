import { complex, argument, modulus } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makePowerFunction = (a: number): Transform2D => {
  return (z) => {
    const theta = argument(z);
    const rPowerSinTheta = Math.pow(modulus(z), math.sin(theta));
    return complex(rPowerSinTheta * math.cos(theta + a), rPowerSinTheta * math.sin(theta + a));
  };
};

export const makePower = () => {
  const a = randomScalar(0, 2 * Math.PI);
  console.log(`makePowerFunction(${a})`);
  return makePowerFunction(a);
};
