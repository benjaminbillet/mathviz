import Complex from 'complex.js';
import fs from 'fs';

export const makeTangentFunction = () => {
  return (z) => new Complex(Math.sin(z.re) / Math.cos(z.im), Math.tan(z.im));
};

export const makeTangent = (file) => {
  fs.appendFileSync(file, 'makeTangentFunction()\n');
  return makeTangentFunction();
};
