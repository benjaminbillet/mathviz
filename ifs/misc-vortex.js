import { makeIfs } from './build';
import * as affine from '../utils/affine';


export const VORTEX1_DOMAIN = { xmin: -4, xmax: 4, ymin: -2.5, ymax: 5.5 };
export const makeVortex1 = () => {
  // a       b      c       d      e    f    p
  // 0.475  -0.823  0.823   0.475  1.0  1.0  0.8
  // 0.5     0.5    0.0     0.5    0.5  0.0  0.2

  const f1 = affine.makeAffine2dFromCoeffs([ 0.475, -0.823, 1.0, 0.823, 0.475, 1.0 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ 0.5,    0.5,   0.5, 0.0,   0.5,   0.0 ]);
  return makeIfs([ f1, f2 ], [ 0.8, 0.2 ]);
};


export const VORTEX2_DOMAIN = { xmin: -9, xmax: 8, ymin: -3, ymax: 14 };
export const makeVortex2 = () => {
  //  a         b         c         d        e        f        p
  //  0.745455 -0.459091  0.406061  0.887121 1.460279 0.691072 0.85
  // -0.424242 -0.065152 -0.175758  0.218182 3.809567 6.741476 0.15

  const f1 = affine.makeAffine2dFromCoeffs([  0.745455, -0.459091, 1.460279,  0.406061, 0.887121, 0.691072 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ -0.424242, -0.065152, 3.809567, -0.175758, 0.218182, 6.741476 ]);
  return makeIfs([ f1, f2 ], [ 0.85, 0.15 ]);
};

export const VORTEX3_DOMAIN = { xmin: -1, xmax: 1.3, ymin: -1, ymax: 1.3 };
export const makeVortex3 = () => {
  // a       b      c      d       e       f      p
  // 0.7517 -0.2736 0.2736 0.7517  0.0000  0.000  0.7
  // 0.2000  0.0000 0.0000 0.2000  1.0000 -0.364  0.1
  // 0.2000  0.0000 0.0000 0.2000 -0.3640  1.000  0.1
  // 0.2000  0.0000 0.0000 0.2000 -0.7280 -0.728  0.1

  const f1 = affine.makeAffine2dFromCoeffs([ 0.7517, -0.2736,  0.0, 0.2736, 0.7517,  0.0 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ 0.2,     0.0,     1.0, 0.0,    0.2,    -0.364 ]);
  const f3 = affine.makeAffine2dFromCoeffs([ 0.2,     0.0,    -0.364, 0.0,  0.2,     1.0 ]);
  const f4 = affine.makeAffine2dFromCoeffs([ 0.2,     0.0,    -0.728, 0.0,  0.2,    -0.728 ]);
  return makeIfs([ f1, f2, f3, f4 ], [ 0.7, 0.1, 0.1, 0.1 ]);
};
