import Complex from 'complex.js';
import fs from 'fs';
import { randomComplex } from '../utils/random';

export const makeJuliaFunction = (c) => {
  return (z) => {
    z = c.sub(z);

    const sqrtOfR = Math.pow(z.im * z.im + z.re * z.re, 0.25);
    const halfTheta = Math.atan2(z.re, z.im) / 2;

    // this transformation occupies half the space, so we make it symmetrical by randomly alternating periods
    let omega = 0;
    if (Math.random() >= 0.5) {
      omega = Math.PI;
    }
    return new Complex(Math.cos(halfTheta + omega) * sqrtOfR, Math.sin(halfTheta + omega) * sqrtOfR);
  };
};

export const makeJulia = (file) => {
  const c = randomComplex(-1, 1);
  fs.appendFileSync(file, `makeJuliaFunction(${c})\n`);
  return makeJuliaFunction(c);
};
