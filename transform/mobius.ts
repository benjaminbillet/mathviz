import { complex, ComplexNumber } from '../utils/complex';
import { randomComplex } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeMobiusFunction = (a: ComplexNumber, b: ComplexNumber, c: ComplexNumber, d: ComplexNumber): Transform2D => {
  // (za + b) / (zc + d)
  return (z) => {
    const numeratorRe = (z.re * a.re - z.im * a.im) + b.re;
    const numeratorIm = (z.re * a.im + z.im * a.re) + b.im;
    const denominatorRe = (z.re * c.re - z.im * c.im) + d.re;
    const denominatorIm = (z.re * c.im + z.im * c.re) + d.im;

    const divisor =  (denominatorRe * denominatorRe + denominatorIm * denominatorIm);
    return complex(
      (numeratorRe * denominatorRe + numeratorIm * denominatorIm) / divisor,
      (numeratorIm * denominatorRe - numeratorRe * denominatorIm) / divisor,
    );
  };
};

export const makeMobius = () => {
  const a = randomComplex(-1, 1);
  const b = randomComplex(-1, 1);
  const c = randomComplex(-1, 1);
  const d = randomComplex(-1, 1);
  console.log(`makeMobiusFunction(${a}, ${b}, ${c}, ${d})`);
  return makeMobiusFunction(a, b, c, d);
};
