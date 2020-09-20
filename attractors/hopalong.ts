import { complex } from '../utils/complex';
import { Attractor } from '../utils/types';

// https://hal.inria.fr/hal-01496082/document

export const makeHopalong = (a: number, b: number, c: number): Attractor => {
  return (z) => complex(z.im - Math.sign(z.re) * Math.sqrt(Math.abs(b * z.re - c)), a - z.re);
};

export const makeChip = (a: number, b: number, c: number): Attractor => {
  return (z) => {
    const u = Math.cos(Math.log(Math.abs(b * z.re - c)));
    const uu = u * u;
    const v = Math.atan(Math.log(Math.abs(c * z.re - b)));
    const vv = v * v;
    return complex(z.im - Math.sign(z.re) * uu * vv, a - z.re);
  };
};

export const makeQuadrupTwo = (a: number, b: number, c: number): Attractor => {
  return (z) => {
    const u = Math.sin(Math.log(Math.abs(b * z.re - c)));
    const v = Math.atan(c * z.re - b);
    const vv = v * v;
    return complex(z.im - Math.sign(z.re) * u * vv, a - z.re);
  };
};

export const makeThreePly = (a: number, b: number, c: number): Attractor => {
  const sinAbc = Math.sin(a + b + c);
  const cosB = Math.cos(b);
  return (z) => complex(z.im - Math.sign(z.re) * Math.abs(Math.sin(z.re) * cosB + c - z.re * sinAbc), a - z.re);
};
