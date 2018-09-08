import Complex from 'complex.js';
import { randomComplex } from '../utils/random';

export const makeJulia = (c) => {
  c = c == null ? randomComplex(-1, 1) : c;
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
  }
};
