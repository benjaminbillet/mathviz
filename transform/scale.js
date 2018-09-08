import { makeAffine2dFromMatrix, scale } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeScale = (x, y) => {
  x = x== null ? randomScalar(-1, 1) : x;
  y = y== null ? randomScalar(-1, 1) : y;
  return makeAffine2dFromMatrix(scale(x, y));
};
