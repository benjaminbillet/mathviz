import Complex from 'complex.js';

export const makeSpherical = () => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    return new Complex(z.re / r2, z.im / r2);
  };
};
