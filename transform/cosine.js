import Complex from 'complex.js';
import fs from 'fs';

export const makeCosineFunction = () => {
  return (z) => {
    const xPi = z.re * Math.PI;
    return new Complex(Math.cos(xPi) * Math.cosh(z.im), - Math.sin(xPi) * Math.sinh(z.im));
  };
};

export const makeCosine = (file) => {
  fs.appendFileSync(file, 'makeCosineFunction()\n');
  return makeCosineFunction();
};
