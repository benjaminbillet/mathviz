import Complex from 'complex.js';
import fs from 'fs';

export const makeSpiralFunction = () => {
  return (z) => {
    const r = z.abs();
    const theta = Math.atan2(z.re, z.im);
    return new Complex((Math.cos(theta) + Math.sin(r)) / r, (Math.sin(theta) - Math.cos(r)) / r);
  };
};

export const makeSpiral = (file) => {
  fs.appendFileSync(file, 'makeSpiralFunction()\n');
  return makeSpiralFunction();
};
