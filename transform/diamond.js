import Complex from 'complex.js';

export const makeDiamond = () => {
  return (z) => {
    const r = z.abs();
    const theta = Math.atan2(z.re, z.im);
    return new Complex(Math.sin(theta) * Math.cos(r), Math.cos(theta) * Math.sin(r));
  };
};
