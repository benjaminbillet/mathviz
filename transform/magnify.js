import Complex from 'complex.js';


export const makeMagnifyFunction = () => {
  return (z) => {
    const oneMinusRSquared = 1 - (z.re * z.re + z.im * z.im);
    return new Complex(z.re / oneMinusRSquared, z.im / oneMinusRSquared);
  };
};

export const makeMagnify = () => {
  console.log('makeMagnifyFunction()');
  return makeMagnifyFunction();
};
