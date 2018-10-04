import Complex from 'complex.js';
import { makeIfs } from './build';

export const APOLLONY_DOMAIN = { xmin: -4, xmax: 4, ymin: -4, ymax: 4 };
export const makeApollonyIfs = (a = 3) => {
  const sqrt3 = Math.sqrt(3);

  const za =  new Complex(a, 0);
  const zb = new Complex(1 + sqrt3, 0);
  const zc = new Complex(-0.5, sqrt3/2);
  const zd = new Complex(-0.5, -sqrt3/2);

  // f1(z) = a / (1 + s - z) - (1 + s) / (2 + s)
  const f1 = (z) => za.div(zb.sub(z)).sub((1 + sqrt3) / (2 + sqrt3));
  // f2(z) = 0.5 (-1 + s i) / f(z)
  const f2 = (z) => zc.div(f1(z));
  // f3(z) = 0.5 (-1 - s i) / f(z)
  const f3 = (z) => zd.div(f1(z));

  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};
