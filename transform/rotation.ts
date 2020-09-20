
import { makeAffine2dFromMatrix, rotate } from '../utils/affine';
import { randomScalar } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeRotationFunction = (theta: number): Transform2D => {
  return makeAffine2dFromMatrix(rotate(theta));
};

export const makeRotation = () => {
  const theta = randomScalar(-2 * Math.PI, 2 * Math.PI);
  console.log(`makeRotationFunction(${theta})`);
  return makeRotationFunction(theta);
};
