import Complex from 'complex.js';
import fs from 'fs';

export const makeFisheyeFunction = () => {
  return (z) => {
    const factor = 2 / (z.abs() + 1);
    return new Complex(factor * z.im, factor * z.re);
  };
};

export const makeFisheye = (file) => {
  fs.appendFileSync(file, 'makeFisheyeFunction()\n');
  return makeFisheyeFunction();
};
