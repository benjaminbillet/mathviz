import { makeAffine2dFromMatrix, rotate } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeRotation = (theta) => {
  theta = theta == null ? randomScalar(-2 * Math.PI, 2 * Math.PI) : theta;
  return makeAffine2dFromMatrix(rotate(theta));
};
