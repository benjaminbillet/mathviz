import Complex from 'complex.js';


export const makeHorseshoeFunction = () => {
  return (z) => {
    const r = z.abs();
    return new Complex(((z.re - z.im) * (z.re + z.im) / r), (2 * z.re * z.im) / r);
  };
};

export const makeHorseshoe = () => {
  console.log('makeHorseshoeFunction()');
  return makeHorseshoeFunction();
};
