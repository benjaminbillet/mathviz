import { complex } from '../utils/complex';
import { Transform2D } from '../utils/types';

export const makeBentFunction = (): Transform2D => {
  return (z) => {
    if (z.re >= 0 && z.im >= 0) {
      return z;
    } else if (z.re < 0 && z.im >= 0) {
      return complex(2 * z.re, z.im);
    } else if (z.re >= 0 && z.im < 0) {
      return complex(z.re, z.im / 2);
    }
    return complex(2 * z.re, z.im / 2);
  };
};

export const makeBent = () => {
  console.log('makeBentFunction()');
  return makeBentFunction();
};
