import { complex } from '../utils/complex';
import { Transform2D } from '../utils/types';

export const makeMagnifyFunction = (): Transform2D => {
  return (z) => {
    const oneMinusRSquared = 1 - (z.re * z.re + z.im * z.im);
    return complex(z.re / oneMinusRSquared, z.im / oneMinusRSquared);
  };
};

export const makeMagnify = () => {
  console.log('makeMagnifyFunction()');
  return makeMagnifyFunction();
};
