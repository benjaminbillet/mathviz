import { complex, modulus, argument } from '../utils/complex';

export const makePolarFunction = () => {
  return (z) => complex(argument(z) / Math.PI, modulus(z) - 1);
};

export const makePolar = () => {
  console.log('makePolarFunction()');
  return makePolarFunction();
};
