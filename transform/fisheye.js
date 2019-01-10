import { complex, modulus } from '../utils/complex';

export const makeFisheyeFunction = () => {
  return (z) => {
    const factor = 2 / (modulus(z) + 1);
    return complex(factor * z.im, factor * z.re);
  };
};

export const makeFisheye = () => {
  console.log('makeFisheyeFunction()');
  return makeFisheyeFunction();
};
