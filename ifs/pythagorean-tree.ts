import { makeIfs } from './build';
import * as affine from '../utils/affine';

export const makePythagoreanTree = (alpha = Math.PI/4) => {
  const cosAlpha = Math.cos(alpha);
  const sinAlpha = Math.sin(alpha);

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0, 1),
    affine.reverseRotate(alpha),
    affine.scale(cosAlpha, cosAlpha),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(cosAlpha * cosAlpha, 1 + cosAlpha * sinAlpha),
    affine.rotate(Math.PI / 2 - alpha),
    affine.scale(sinAlpha, sinAlpha),
  ));
  const f3 = affine.IDENTITY_FUNC;
  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};


