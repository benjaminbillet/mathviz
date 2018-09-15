import Complex from 'complex.js';
import fs from 'fs';
import { randomComplex } from '../utils/random';

export const makeMobiusFunction = (a, b, c, d) => {
  // (za + b) / (zc + d)
  return (z) => {
    const numeratorRe = (z.re * a.re - z.im * a.im) + b.re;
    const numeratorIm = (z.re * a.im + z.im * a.re) + b.im;
    const denominatorRe = (z.re * c.re - z.im * c.im) + d.re;
    const denominatorIm = (z.re * c.im + z.im * c.re) + d.im;

    const divisor =  (denominatorRe * denominatorRe + denominatorIm * denominatorIm);
    return new Complex(
      (numeratorRe * denominatorRe + numeratorIm * denominatorIm) / divisor,
      (numeratorIm * denominatorRe - numeratorRe * denominatorIm) / divisor,
    );
  };
};

export const makeMobius = (file) => {
  const a = randomComplex(-1, 1);
  const b = randomComplex(-1, 1);
  const c = randomComplex(-1, 1);
  const d = randomComplex(-1, 1);
  fs.appendFileSync(file, `makeMobiusFunction(${a}, ${b}, ${c}, ${d})\n`);
  return makeMobiusFunction(a, b, c, d);
};
