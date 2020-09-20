import { ComplexNumber } from '../utils/complex';
import { randomComplex } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeCpowFunction = (cpow: ComplexNumber): Transform2D => {
  return z => z.pow(cpow);
};

export const makeCpow = () => {
  const cpow = randomComplex();
  console.log(`makeCpowFunction(${cpow})`);
  return makeCpowFunction(cpow);
};
