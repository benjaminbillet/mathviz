import { complex } from '../utils/complex';
import { binomial } from '../utils/random';
import { ComplexToComplexFunction } from '../utils/types';

// https://hal.inria.fr/hal-01496082/document

export const makeKrasnoselskijIterator = (f: ComplexToComplexFunction, lambda: number): ComplexToComplexFunction => {
  const oneMinusLambda = 1 - lambda;
  return (z) => {
    const fz = f(z);
    return complex(lambda * fz.re + oneMinusLambda * z.re, lambda * fz.im + oneMinusLambda * z.im);
  };
};

export const makeKrasnoselskijPicardIterator = (f: ComplexToComplexFunction, lambda: number): ComplexToComplexFunction => {
  const oneMinusLambda = 1 - lambda;
  return (z) => {
    const fz = f(z);
    if (binomial() === 0) {
      return fz; // picard iteration
    }
    return complex(lambda * fz.re + oneMinusLambda * z.re, lambda * fz.im + oneMinusLambda * z.im);
  };
};

export const makeKrasnoselskijPerturbatedIterator = (f: ComplexToComplexFunction, p: ComplexToComplexFunction, lambda: number): ComplexToComplexFunction => {
  const oneMinusLambda = 1 - lambda;
  return (z) => {
    const fz = f(z);
    const fpz = f(p(z)); // perturbated
    return complex(lambda * fz.re + oneMinusLambda * fpz.re, lambda * fz.im + oneMinusLambda * fpz.im);
  };
};
