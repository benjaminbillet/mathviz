import { makeIfs } from './build';
import * as affine from '../utils/affine';

export const PYTHAGOREAN_TREE_DOMAIN = { xmin: -3, xmax: 3, ymin: 0, ymax: 6 };
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
    affine.reverseRotate(-alpha),
    affine.scale(sinAlpha, sinAlpha),
  ));
  const f3 = (z) => z; // identity
  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};


