import Complex from 'complex.js';

export const makeBubble = () => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    const factor = 4 / (r2 + 4);
    return new Complex(factor * z.re, factor * z.im);
  };
};
