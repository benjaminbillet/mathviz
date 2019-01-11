import { complex } from '../utils/complex';
import { binomial } from '../utils/random';

export const makeKrasnoselskijIterator = (f, lambda) => {
  const oneMinusLambda = 1 - lambda;
  return (z) => {
    const fz = f(z);
    return complex(alpha * fz.re + oneMinusLambda * z.re, alpha * fz.im + oneMinusLambda * z.im);
  };
};

export const makeKrasnoselskijPicardIterator = (f, lambda) => {
  const oneMinusLambda = 1 - lambda;
  return (z) => {
    const fz = f(z);
    if (binomial() === 0) {
      return fz; // picard iteration
    }
    return complex(alpha * fz.re + oneMinusLambda * z.re, alpha * fz.im + oneMinusLambda * z.im);
  };
};

export const makeKrasnoselskijPerturbatedIterator = (f, p, lambda) => {
  const oneMinusLambda = 1 - lambda;
  return (z) => {
    const fz = f(z);
    const fpz = f(p(z)); // perturbated
    return complex(lambda * fz.re + oneMinusLambda * fpz.re, lambda * fz.im + oneMinusLambda * fpz.im);
  };
};
