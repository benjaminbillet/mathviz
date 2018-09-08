import Complex from 'complex.js';

export const makeBent = () => {
  return (z) => {
    if (z.re >= 0 && z.im >= 0) {
      return z;
    } else if (z.re < 0 && z.im >= 0) {
      return new Complex(2 * z.re, z.im);
    } else if (z.re >= 0 && z.im < 0) {
      return new Complex(z.re, z.im / 2);
    }
    return new Complex(2 * z.re, z.im / 2);
  };
};
