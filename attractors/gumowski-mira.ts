import { complex } from '../utils/complex';
import { Attractor, RealToRealFunction } from '../utils/types';

// http://www.scipress.org/journals/forma/pdf/1502/15020121.pdf
// http://shodhganga.inflibnet.ac.in/bitstream/10603/22501/11/11_chapter3.pdf

export const makeGumowskiMira = (a: number, mu: number): Attractor => {
  const f: RealToRealFunction = (x) => mu * x + 2 * (1 - mu) * x * x / (1 + x * x);

  return (z) => {
    const re = z.im + a * (1 - 0.05 * z.im * z.im) * z.im + f(z.re);
    const im = f(re) - z.re;
    return complex(re, im);
  };
};
