import { complex, modulus, argument } from '../utils/complex';
import { Transform2D } from '../utils/types';

export const makePolarFunction = (): Transform2D => {
  return (z) => complex(argument(z) / Math.PI, modulus(z) - 1);
};

export const makePolar = () => {
  console.log('makePolarFunction()');
  return makePolarFunction();
};
