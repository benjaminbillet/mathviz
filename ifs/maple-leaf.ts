import { makeIfs } from './build';
import affine from '../utils/affine';

export const MAPLE_LEAF_DOMAIN = { xmin: -4, xmax: 4, ymin: -4, ymax: 4 };
export const makeMapleLeaf = () => {
  const f1 = affine.makeAffine2dFromCoeffs([ 0.14,  0.01, -0.08,  0.0,  0.51, -1.31 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ 0.43,  0.52,  1.49, -0.45, 0.5,  -0.75 ]);
  const f3 = affine.makeAffine2dFromCoeffs([ 0.45, -0.49, -1.62,  0.47, 0.47, -0.74 ]);
  const f4 = affine.makeAffine2dFromCoeffs([ 0.49,  0.0,   0.02,  0.0,  0.51,  1.62 ]);
  return makeIfs([ f1, f2, f3, f4 ], [ 1/4, 1/4, 1/4, 1/4 ]);
};
