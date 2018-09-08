import Complex from 'complex.js';

export const makeCylinder = () => {
  return (z) => new Complex(Math.sin(z.re), z.im);
};
