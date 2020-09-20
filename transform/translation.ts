
import { translate, makeAffine2dFromMatrix } from '../utils/affine';
import { randomScalar } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeTranslationFunction = (x: number, y: number): Transform2D => {
  return makeAffine2dFromMatrix(translate(x, y));
};

export const makeTranslation = () => {
  const x = randomScalar(-1, 1);
  const y = randomScalar(-1, 1);
  console.log(`makeTranslationFunction(${x}, ${y})`);
  return makeTranslationFunction(x, y);
};
