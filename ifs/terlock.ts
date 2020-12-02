import { makeIfs } from './build';
import affine from '../utils/affine';

export const MAPLE_LEAF_DOMAIN = { xmin: -4, xmax: 4, ymin: -4, ymax: 4 };
export const makeTerlock = () => {
  const f1 = affine.makeAffine2dFromCoeffs([ 0.5, -0.2886751, 0.2886751, 0.5, 0, 0, 0.33 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ -0.5, 0.2886751, 0.2886751, 0.5, 1, 0, 0.33 ]);
  const f3 = affine.makeAffine2dFromCoeffs([ 0.5, -0.2886751, 0.2886751, 0.5, 1, 0, 0.34 ]);
  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};
