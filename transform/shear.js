
import { makeAffine2dFromMatrix, shear } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeShearFunction = (x, y) => {
  return makeAffine2dFromMatrix(shear(x, y));
};

export const makeShear = () => {
  const x = randomScalar(-1, 1);
  const y = randomScalar(-1, 1);
  console.log(`makeShearFunction(${x}, ${y})`);
  return makeShearFunction(x, y);
};
