import Complex from 'complex.js';
import fs from 'fs';

export const makeSphericalFunction = () => {
  return (z) => {
    const rSquared = z.re * z.re + z.im * z.im;
    return new Complex(z.re / rSquared, z.im / rSquared);
  };
};

export const makeSpherical = (file) => {
  fs.appendFileSync(file, 'makeSphericalFunction()\n');
  return makeSphericalFunction();
};
