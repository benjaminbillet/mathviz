import Complex from 'complex.js';

export const makeExponential = () => {
  return (z) => {
    const expOfXMinusOne = Math.exp(z.re - 1)
    const yPi = Math.PI * z.im;
    return new Complex(expOfXMinusOne * Math.cos(yPi), expOfXMinusOne * Math.sin(yPi));
  };
};
