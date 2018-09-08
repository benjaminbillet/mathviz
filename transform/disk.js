import Complex from 'complex.js';

export const makeDisk = () => {
  return (z) => {
    const thetabypi = Math.atan2(z.re, z.im) / Math.PI;
    const pir = Math.PI * z.abs();
    return new Complex(Math.sin(pir) * thetabypi, Math.cos(pir) * thetabypi);
  };
};
