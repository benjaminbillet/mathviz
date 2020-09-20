import { complex } from '../utils/complex';
import math from '../utils/math';
import { Attractor } from '../utils/types';

// http://paulbourke.net/fractals/peterdejong/

export const makePeterDeJungAttractor = (a: number, b: number, c: number, d: number): Attractor => {
  return (z) => {
    const re = math.sin(z.im * a) - math.cos(z.re * b);
    const im = math.sin(z.re * c) - math.cos(z.im * d);
    return complex(re, im);
  };
};

export const makeJohnnySvenssonAttractor = (a: number, b: number, c: number, d: number): Attractor => {
  return (z) => {
    const re = d * math.sin(z.re * a) - math.sin(z.im * b);
    const im = c * math.cos(z.re * a) - math.cos(z.im * b);
    return complex(re, im);
  };
};
