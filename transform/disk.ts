import { complex, argument, modulus } from '../utils/complex';

import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeDiskFunction = (): Transform2D => {
  return (z) => {
    const thetabypi = argument(z) / Math.PI;
    const pir = Math.PI * modulus(z);
    return complex(math.sin(pir) * thetabypi, math.cos(pir) * thetabypi);
  };
};

export const makeDisk = () => {
  console.log('makeDiskFunction()');
  return makeDiskFunction();
};
