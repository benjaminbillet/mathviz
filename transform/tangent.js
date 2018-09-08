import Complex from 'complex.js';

export const makeTangent = () => {
  return (z) => new Complex(Math.sin(z.re) / Math.cos(z.im), Math.tan(z.im));
};
