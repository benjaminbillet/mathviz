import Complex from 'complex.js';

export const makeKrasnoselskijIterator = (f, lambda) => {
  const oneMinusLambda = 1 - lambda;
  return (z) => {
    const fz = f(z);
    return new Complex(alpha * fz.re + oneMinusLambda * z.re, alpha * fz.im + oneMinusLambda * z.im);
  };
};

export const makeKrasnoselskijPicardIterator = (f, lambda) => {
  const oneMinusLambda = 1 - lambda;
  return (z) => {
    const fz = f(z);
    if (Math.random() < 0.5) {
      return fz; // picard iteration
    }
    return new Complex(alpha * fz.re + oneMinusLambda * z.re, alpha * fz.im + oneMinusLambda * z.im);
  };
};

export const makeKrasnoselskijPerturbatedIterator = (f, p, lambda) => {
  const oneMinusLambda = 1 - lambda;
  return (z) => {
    const fz = f(z);
    const fpz = f(p(z)); // perturbated
    return new Complex(lambda * fz.re + oneMinusLambda * fpz.re, lambda * fz.im + oneMinusLambda * fpz.im);
  };
};
