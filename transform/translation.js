
import { translate, makeAffine2dFromMatrix } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeTranslationFunction = (x, y) => {
  return makeAffine2dFromMatrix(translate(x, y));
};

export const makeTranslation = () => {
  const x = randomScalar(-1, 1);
  const y = randomScalar(-1, 1);
  console.log(`makeTranslationFunction(${x}, ${y})`);
  return makeTranslationFunction(x, y);
};
