import { makeIfs } from './build';
import affine from '../utils/affine';

export const DRAGON1_DOMAIN = { xmin: -7, xmax: 7, ymin: -2, ymax: 12 };
export const makeDragon1 = () => {
  //       set 1       set 2
  // a     0.824074    0.088272
  // b     0.281428    0.520988
  // c    -0.212346   -0.463889
  // d     0.864198   -0.377778
  // e    -1.882290    0.785360
  // f    -0.110607    8.095795
  // p     0.8         0.2

  const f1 = affine.makeAffine2dFromCoeffs([ 0.824074, 0.281428, -1.882290, -0.212346,  0.864198, -0.110607 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ 0.088272, 0.520988,  0.785360, -0.463889, -0.377778,  8.095795 ]);
  return makeIfs([ f1, f2 ], [ 0.8, 0.2 ]);
};


export const DRAGON2_DOMAIN = { xmin: -7, xmax: 21, ymin: -13, ymax: 15 };
export const makeDragon2 = () => {
  // a        b         c         d        e        f         p
  // 0.824074 0.581482 -0.212346  0.864198 1.882290 0.110607  0.787473
  // 0.088272 0.420988 -0.463889 -0.377778 0.785360 8.095795  0.212528

  const f1 = affine.makeAffine2dFromCoeffs([ 0.824074, 0.581482, 1.882290, -0.212346,  0.864198, 0.110607 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ 0.088272, 0.420988, 0.785360, -0.463889, -0.377778, 8.095795 ]);
  return makeIfs([ f1, f2 ], [ 0.787473, 0.212528 ]);
};


export const DRAGON3_DOMAIN = { xmin: -1.2, xmax: 0.5, ymin: -0.5, ymax: 1.2 };
export const makeDragon3 = () => {
  // a            b          c           d          e          f         p
  // -0.16666667 -0.1666667  0.16666667 -0.1666667  0.0000000  0.000000  0.163
  //  0.83333333  0.2500000 -0.25000000  0.8333333 -0.1666667 -0.166667  0.600
  //  0.33333333 -0.0833333  0.08333333  0.3333333  0.0833333  0.666667  0.237

  const f1 = affine.makeAffine2dFromCoeffs([ -0.16666667, -0.1666667,  0.0,        0.16666667, -0.1666667,  0.0 ]);
  const f2 = affine.makeAffine2dFromCoeffs([  0.83333333,  0.25,      -0.1666667, -0.25,        0.8333333, -0.166667 ]);
  const f3 = affine.makeAffine2dFromCoeffs([  0.33333333, -0.08333333, 0.0833333,  0.08333333,  0.3333333,  0.666667 ]);
  return makeIfs([ f1, f2, f3 ], [ 0.163, 0.6, 0.237 ]);
};


export const DRAGON4_DOMAIN = { xmin: -0.5, xmax: 1.1, ymin: -0.6, ymax: 1 };
export const makeDragon4 = () => {
  // a      b      c      d      e      f      p
  // 0.693  0.400 -0.400  0.693  0.0    0.0    0.85
  // 0.346 -0.200  0.200  0.346  0.693  0.400  0.15

  const f1 = affine.makeAffine2dFromCoeffs([ 0.693,  0.4, 0.0,  -0.4, 0.693, 0.0 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ 0.346, -0.2, 0.693, 0.2, 0.346, 0.4 ]);
  return makeIfs([ f1, f2 ], [ 0.85, 0.15 ]);
};

