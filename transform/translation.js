import { translate, makeAffine2dFromMatrix } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeTranslation = (x, y) => {
  x = x== null ? randomScalar(-1, 1) : x;
  y = y== null ? randomScalar(-1, 1) : y;
  return makeAffine2dFromMatrix(translate(x, y));
};
