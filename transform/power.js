import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makePower = (a) => {
  a = a == null ? randomScalar(0, 2 * Math.PI) : a;
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const rPowerSinTheta = Math.pow(z.abs(), Math.sin(theta))
    return new Complex(rPowerSinTheta * Math.cos(theta + a), rPowerSinTheta * Math.sin(theta + a));
  };
};
