import { complex } from '../utils/complex';

export const makeMagnifyFunction = () => {
  return (z) => {
    const oneMinusRSquared = 1 - (z.re * z.re + z.im * z.im);
    return complex(z.re / oneMinusRSquared, z.im / oneMinusRSquared);
  };
};

export const makeMagnify = () => {
  console.log('makeMagnifyFunction()');
  return makeMagnifyFunction();
};
