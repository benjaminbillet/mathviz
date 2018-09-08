import { makeAffine2dFromMatrix, shear } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeShear = (x, y) => {
  x = x== null ? randomScalar(-1, 1) : x;
  y = y== null ? randomScalar(-1, 1) : y;
  return makeAffine2dFromMatrix(shear(x, y));
};
