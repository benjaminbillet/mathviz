import Complex from 'complex.js';

export const makeCosine = () => {
  return (z) => {
    const xPi = z.re * Math.PI;
    return new Complex(Math.cos(xPi) * Math.cosh(z.im), - Math.sin(xPi) * Math.sinh(z.im));
  };
};

