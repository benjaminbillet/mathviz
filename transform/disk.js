import Complex from 'complex.js';

import math from '../utils/math';

export const makeDiskFunction = () => {
  return (z) => {
    const thetabypi = math.atan2(z.im, z.re) / Math.PI;
    const pir = Math.PI * z.abs();
    return new Complex(math.sin(pir) * thetabypi, math.cos(pir) * thetabypi);
  };
};

export const makeDisk = () => {
  console.log('makeDiskFunction()');
  return makeDiskFunction();
};
