import Complex from 'complex.js';

export const makeEx = () => {
  return (z) => {
    const r = z.abs();
    const theta = Math.atan2(z.re, z.im);
    const p0 = Math.sin(theta + r);
    const p1 = Math.cos(theta - r);
    return new Complex(r * (p0 * p0 * p0 + p1 * p1 * p1), r * (p0 * p0 * p0 - p1 * p1 * p1));
  };
};
