import Complex from 'complex.js';
import fs from 'fs';

export const makeExponentialFunction = () => {
  return (z) => {
    const expOfXMinusOne = Math.exp(z.re - 1);
    const yPi = Math.PI * z.im;
    return new Complex(expOfXMinusOne * Math.cos(yPi), expOfXMinusOne * Math.sin(yPi));
  };
};

export const makeExponential = (file) => {
  fs.appendFileSync(file, 'makeExponentialFunction()\n');
  return makeExponentialFunction();
};
