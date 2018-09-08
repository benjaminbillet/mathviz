import Complex from 'complex.js';

export const makeHandkerchief = () => {
  return (z) => {
    const theta = Math.atan2(z.re, z.im);
    const r = z.abs();
    return new Complex(Math.sin(theta + r) * r, Math.cos(theta - r) * r);
  };
};
