import { add, complex, mul, powN } from '../utils/complex';
import { randomScalar, randomInteger } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makePolynomialFunction = (...factors: number[]): Transform2D => {
  return (z) => {
    let result = complex();
    for (let i = 0; i < factors.length; i++) {
      if (factors[i] !== 0) {
        if (i === 0) {
          result.re = factors[i];
        } else {
          result = add(result, mul(powN(z, i), factors[i]), result);
        }
      }
    }
    return result;
  };
};

export const makePolynomial = () => {
  const an = new Array(randomInteger(2, 10)).fill(null).map(_ => randomScalar(-Math.PI, Math.PI));
  console.log(`makePolynomial(${an.join(',')})`);
  return makePolynomialFunction();
};
