import Complex from 'complex.js';
import fs from 'fs';

export const makeDiskFunction = () => {
  return (z) => {
    const thetabypi = Math.atan2(z.re, z.im) / Math.PI;
    const pir = Math.PI * z.abs();
    return new Complex(Math.sin(pir) * thetabypi, Math.cos(pir) * thetabypi);
  };
};

export const makeDisk = (file) => {
  fs.appendFileSync(file, 'makeDiskFunction()\n');
  return makeDiskFunction();
};
