import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makePowerFunction = (a) => {
  return (z) => {
    const theta = math.atan2(z.im, z.re);
    const rPowerSinTheta = Math.pow(z.abs(), math.sin(theta));
    return new Complex(rPowerSinTheta * math.cos(theta + a), rPowerSinTheta * math.sin(theta + a));
  };
};

export const makePower = (file) => {
  const a = randomScalar(0, 2 * Math.PI);
  fs.appendFileSync(file, `makePowerFunction(${a})\n`);
  return makePowerFunction(a);
};
