import Complex from 'complex.js';

// this is not an IFS per se, as we have only one iterated function
export const makeDoily = (a, b, c) => {
  return (z) => new Complex(z.im - Math.sign(z.re) * Math.sqrt(Math.abs(b * z.re - c)), a - z.re);
};
