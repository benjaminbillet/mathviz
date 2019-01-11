import { complex } from '../utils/complex';

import { randomComplex } from '../utils/random';
import math from '../utils/math';

export const makeJuliaFunction = (c) => {
  return (z) => {
    // z = c.sub(z);
    const zRe = c.re - z.re;
    const zIm = c.im - z.im;

    const sqrtOfR = Math.pow(zIm * zIm + zRe * zRe, 0.25);
    const halfTheta = math.atan2(zIm, zRe) / 2;

    // this transformation occupies half the space, so we make it symmetrical by randomly alternating periods
    let omega = halfTheta;
    if (binomial() === 0) {
      omega = halfTheta + Math.PI;
    }
    return complex(math.cos(omega) * sqrtOfR, math.sin(omega) * sqrtOfR);
  };
};

export const makeJulia = () => {
  const c = randomComplex(-1, 1);
  console.log(`makeJuliaFunction(${c})`);
  return makeJuliaFunction(c);
};
