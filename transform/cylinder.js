import Complex from 'complex.js';
import fs from 'fs';

export const makeCylinderFunction = () => {
  return (z) => new Complex(Math.sin(z.re), z.im);
};

export const makeCylinder = (file) => {
  fs.appendFileSync(file, 'makeCylinderFunction()\n');
  return makeCylinderFunction();
};
