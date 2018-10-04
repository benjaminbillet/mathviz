import Complex from 'complex.js';
import { makeIfs } from './build';

export const MAULDIN_GASKET_DOMAIN = { xmin: -1, xmax: 1, ymin: -1, ymax: 1 };
export const makeMauldinGasketIfs = (a = 3) => {
  const sqrt3 = Math.sqrt(3);
  const sqrt1p5 = Math.sqrt(1.5);
  const cos30 = Math.cos(Math.PI / 6); // 30 degrees

  const f = (x, y) => {
    const xa = (sqrt3 - 1) * x + 1;
    const ya = (sqrt3 - 1) * y;
    const xb = -x + (sqrt3 + 1);
    const yb = -y;

    const factor = 1 / (xb * xb + yb * yb);
    const xc = xb * factor;
    const yc = -yb * factor;

    return new Complex((xa * xc - ya * yc) * sqrt1p5, (xa * yc + xc * ya) * sqrt1p5);
  };

  const f1 = (z) => {
    const x = -0.5 * z.re - cos30 * z.im;
    const y = -0.5 * z.im + cos30 * z.re;
    return f(x, y);
  };
  const f2 = (z) => {
    const xa = -0.5 * z.re - cos30 * z.im;
    const ya = -0.5 * z.im + cos30 * z.re;

    const xb = xa * xa - ya * ya;
    const yb = 2 * xa * ya;

    return f(xb, yb);
  };
  const f3 = (z) => f(z.re, z.im);
  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};
