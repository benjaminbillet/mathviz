import Complex from 'complex.js';

export const makeMagnify = () => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    return new Complex(z.re / (1 - r2), z.im / (1 - r2));
  };
};
