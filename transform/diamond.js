import { complex, argument, modulus } from '../utils/complex';

import math from '../utils/math';

export const makeDiamondFunction = () => {
  return (z) => {
    const r = modulus(z);
    const theta = argument(z);
    return complex(math.sin(theta) * math.cos(r), math.cos(theta) * math.sin(r));
  };
};

export const makeDiamond = () => {
  console.log('makeDiamondFunction()');
  return makeDiamondFunction();
};
