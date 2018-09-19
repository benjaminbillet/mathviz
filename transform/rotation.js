
import { makeAffine2dFromMatrix, rotate } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeRotationFunction = (theta) => {
  return makeAffine2dFromMatrix(rotate(theta));
};

export const makeRotation = () => {
  const theta = randomScalar(-2 * Math.PI, 2 * Math.PI);
  console.log(`makeRotationFunction(${theta})`);
  return makeRotationFunction(theta);
};
