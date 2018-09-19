
import { makeAffine2dFromMatrix, scale } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeScaleFunction = (x, y) => {
  return makeAffine2dFromMatrix(scale(x, y));
};

export const makeScale = () => {
  const x = randomScalar(-1, 1);
  const y = randomScalar(-1, 1);
  console.log(`makeScaleFunction(${x}, ${y})`);
  return makeScaleFunction(x, y);
};
