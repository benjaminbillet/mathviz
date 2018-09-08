import Complex from 'complex.js';

export const makeHorseshoe = () => {
  return (z) => {
    const r = z.abs();
    return new Complex(((z.re - z.im) * (z.re + z.im) / r), (2 * z.re * z.im) / r);
  };
};
