import Complex from 'complex.js';
import fs from 'fs';

export const makeSphericalFunction = () => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    return new Complex(z.re / r2, z.im / r2);
  };
};

export const makeSpherical = (file) => {
  fs.appendFileSync(file, 'makeSphericalFunction()\n');
  return makeSphericalFunction();
};
