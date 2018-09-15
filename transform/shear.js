import fs from 'fs';
import { makeAffine2dFromMatrix, shear } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeShearFunction = (x, y) => {
  return makeAffine2dFromMatrix(shear(x, y));
};

export const makeShear = (file) => {
  x = randomScalar(-1, 1);
  y = randomScalar(-1, 1);
  fs.appendFileSync(file, `makeShearFunction(${x}, ${y})\n`);
  return makeShearFunction(x, y);
};
