import { complex } from '../utils/complex';

import math from '../utils/math';

export const makeCylinderFunction = () => {
  return (z) => complex(math.sin(z.re), z.im);
};

export const makeCylinder = () => {
  console.log('makeCylinderFunction()');
  return makeCylinderFunction();
};
