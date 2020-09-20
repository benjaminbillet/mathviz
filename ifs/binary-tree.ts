import { makeIfs } from './build';
import * as affine from '../utils/affine';

export const BINARY_TREE_DOMAIN = { xmin: -2, xmax: 2, ymin: 0, ymax: 4 };
export const makeBinaryTree = (theta = Math.PI/3, r = 0.65) => {
  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0, 1),
    affine.reverseRotate(theta),
    affine.scale(r, r),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0, 1),
    affine.reverseRotate(-theta),
    affine.scale(r, r),
  ));
  const f3 = affine.IDENTITY_FUNC;
  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};
