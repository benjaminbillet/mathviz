import Complex from 'complex.js';

export const makeSinusoidal = () => {
  return (z) => new Complex(Math.sin(z.re), Math.sin(z.im));
};
