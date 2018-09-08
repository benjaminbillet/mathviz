import Complex from 'complex.js';

export const makeHyperbolic = () => {
  return (z) => {
    const r = z.abs();
    const theta = Math.atan2(z.re, z.im);
    return new Complex(Math.sin(theta) / r, r * Math.cos(theta));
  };
};
