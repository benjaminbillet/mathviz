import { complex } from '../utils/complex';

import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeCylinderFunction = (): Transform2D => {
  return (z) => complex(math.sin(z.re), z.im);
};

export const makeCylinder = () => {
  console.log('makeCylinderFunction()');
  return makeCylinderFunction();
};
