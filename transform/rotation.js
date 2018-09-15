import fs from 'fs';
import { makeAffine2dFromMatrix, rotate } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeRotationFunction = (theta) => {
  return makeAffine2dFromMatrix(rotate(theta));
};

export const makeRotation = (file) => {
  const theta = randomScalar(-2 * Math.PI, 2 * Math.PI);
  fs.appendFileSync(file, `makeRotationFunction(${theta})\n`);
  return makeRotationFunction(theta);
};
