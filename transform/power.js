import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makePowerFunction = (a) => {
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const rPowerSinTheta = Math.pow(z.abs(), Math.sin(theta));
    return new Complex(rPowerSinTheta * Math.cos(theta + a), rPowerSinTheta * Math.sin(theta + a));
  };
};

export const makePower = (file) => {
  const a = randomScalar(0, 2 * Math.PI);
  fs.appendFileSync(file, `makePowerFunction(${a})\n`);
  return makePowerFunction(a);
};
