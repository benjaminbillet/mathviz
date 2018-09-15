import fs from 'fs';
import { translate, makeAffine2dFromMatrix } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeTranslationFunction = (x, y) => {
  return makeAffine2dFromMatrix(translate(x, y));
};

export const makeTranslation = (file) => {
  x = randomScalar(-1, 1);
  y = randomScalar(-1, 1);
  fs.appendFileSync(file, `makeTranslationFunction(${x}, ${y})\n`);
  return makeTranslationFunction(x, y);
};
