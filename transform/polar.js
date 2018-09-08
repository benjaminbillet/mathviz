import Complex from 'complex.js';

export const makePolar = () => {
  return (z) => new Complex(Math.atan2(z.re, z.im) / Math.PI, z.abs() - 1);
};
