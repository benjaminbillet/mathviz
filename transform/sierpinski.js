import { complex } from '../utils/complex';
import { random } from '../utils/random';

export const makeSierpinskiFunction = (jump) => {
  return (z) => {
    if (z.im >= jump) {
      return complex(2 * z.re, 2 * z.im - 1);
    } else if (z.re >= jump) {
      return complex(2 * z.re - 1, 2 * z.im);
    }
    return complex(2 * z.re, 2 * z.im);
  };
};

export const makeSierpinski = () => {
  const jump = random();
  console.log(`makeSierpinskiFunction(${jump})`);
  return makeSierpinskiFunction(jump);
};
