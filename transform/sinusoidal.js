import Complex from 'complex.js';
import fs from 'fs';

export const makeSinusoidalFunction = () => {
  return (z) => new Complex(Math.sin(z.re), Math.sin(z.im));
};

export const makeSinusoidal = (file) => {
  fs.appendFileSync(file, 'makeSinusoidalFunction()\n');
  return makeSinusoidalFunction();
};
