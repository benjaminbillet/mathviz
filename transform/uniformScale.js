
import { makeAffine2dFromMatrix, scale } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeUniformScaleFunction = (s) => {
  return makeAffine2dFromMatrix(scale(s, s));
};

export const makeUniformScale = () => {
  const s = randomScalar(0, 4);
  console.log(`makeUniformScaleFunction(${s})`);
  return makeUniformScaleFunction(s);
};
