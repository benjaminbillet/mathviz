import { complex, modulus } from '../utils/complex';
import { Transform2D } from '../utils/types';

export const makeHorseshoeFunction = (): Transform2D => {
  return (z) => {
    const r = modulus(z);
    return complex(((z.re - z.im) * (z.re + z.im) / r), (2 * z.re * z.im) / r);
  };
};

export const makeHorseshoe = () => {
  console.log('makeHorseshoeFunction()');
  return makeHorseshoeFunction();
};
