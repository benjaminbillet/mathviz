import { pow } from '../utils/complex';
import { randomComplex } from '../utils/random';

export const makeCpowFunction = (cpow) => {
  return z => pow(z, cpow);
};

export const makeCpow = () => {
  const cpow = randomComplex();
  console.log(`makeCpowFunction(${cpow})`);
  return makeCpowFunction(cpow);
};
