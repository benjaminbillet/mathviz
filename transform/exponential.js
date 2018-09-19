import Complex from 'complex.js';

import math from '../utils/math';

export const makeExponentialFunction = () => {
  return (z) => {
    const expOfXMinusOne = Math.exp(z.re - 1);
    const yPi = Math.PI * z.im;
    return new Complex(expOfXMinusOne * math.cos(yPi), expOfXMinusOne * math.sin(yPi));
  };
};

export const makeExponential = () => {
  console.log('makeExponentialFunction()');
  return makeExponentialFunction();
};
