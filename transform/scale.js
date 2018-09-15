import fs from 'fs';
import { makeAffine2dFromMatrix, scale } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeScaleFunction = (x, y) => {
  return makeAffine2dFromMatrix(scale(x, y));
};

export const makeScale = (file) => {
  x = randomScalar(-1, 1);
  y = randomScalar(-1, 1);
  fs.appendFileSync(file, `makeScaleFunction(${a}, ${b})\n`);
  return makeScaleFunction(a, b);
};
