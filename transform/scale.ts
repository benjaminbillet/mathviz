
import { makeAffine2dFromMatrix, scale } from '../utils/affine';
import { randomScalar } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeScaleFunction = (x: number, y: number): Transform2D => {
  return makeAffine2dFromMatrix(scale(x, y));
};

export const makeScale = () => {
  const x = randomScalar(-1, 1);
  const y = randomScalar(-1, 1);
  console.log(`makeScaleFunction(${x}, ${y})`);
  return makeScaleFunction(x, y);
};
