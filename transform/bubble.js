import Complex from 'complex.js';
import fs from 'fs';

export const makeBubbleFunction = () => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    const factor = 4 / (r2 + 4);
    return new Complex(factor * z.re, factor * z.im);
  };
};

export const makeBubble = (file) => {
  fs.appendFileSync(file, 'makeBubbleFunction()\n');
  return makeBubbleFunction();
};
