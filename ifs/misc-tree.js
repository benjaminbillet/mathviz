import { makeIfs } from './build';
import * as affine from '../utils/affine';

export const TREE1_DOMAIN = { xmin: -1, xmax: 1, ymin: -1, ymax: 1 };
export const makeTree1 = () => {
  //       set 1     set 2     set 3     set 4     set 5     set 6     set 7
  // a     0.0500   -0.0500    0.0300   -0.0300    0.5600    0.1900   -0.3300
  // b     0.0000    0.0000   -0.1400    0.1400    0.4400    0.0700   -0.3400
  // c     0.0000    0.0000    0.0000    0.0000   -0.3700   -0.1000   -0.3300
  // d     0.4000   -0.4000    0.2600   -0.2600    0.5100    0.1500    0.3400
  // e    -0.0600   -0.0600   -0.1600   -0.1600    0.3000   -0.2000   -0.5400
  // f    -0.4700   -0.4700   -0.0100   -0.0100    0.1500    0.2800    0.3900

  const f1 = affine.makeAffine2dFromCoeffs([  0.05,  0.0,  -0.06,  0.0,  0.4,  -0.47 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ -0.05,  0.0,  -0.06,  0.0, -0.4,  -0.47 ]);
  const f3 = affine.makeAffine2dFromCoeffs([  0.03, -0.14, -0.16,  0.0,  0.26, -0.01 ]);
  const f4 = affine.makeAffine2dFromCoeffs([ -0.03,  0.14, -0.16,  0.0, -0.26, -0.01 ]);
  const f5 = affine.makeAffine2dFromCoeffs([  0.56,  0.44,  0.3,  -0.37, 0.51,  0.15 ]);
  const f6 = affine.makeAffine2dFromCoeffs([  0.19,  0.07, -0.2,  -0.1,  0.15,  0.28 ]);
  const f7 = affine.makeAffine2dFromCoeffs([ -0.33, -0.34, -0.54, -0.33, 0.34,  0.39 ]);

  return makeIfs([ f1, f2, f3, f4, f5, f6, f7 ], [ 1/7, 1/7, 1/7, 1/7, 1/7, 1/7, 1/7 ]);
};

export const TREE2_DOMAIN = { xmin: -1.1, xmax: 1.1, ymin: -0.1, ymax: 2.1 };
export const makeTree2 = () => {
  // xn+1 = r cos(theta) xn - s sin(phi) yn + e
  // yn+1 = r sin(theta) xn + s cos(phi) yn + f
  //           set 1     set 2     set 3     set 4     set 5     set 6
  //     r     0.0500    0.0500    0.6000    0.5000    0.5000    0.5500
  //     s     0.6000   -0.5000    0.5000    0.4500    0.5500    0.4000
  // theta     0.0000    0.0000    0.6980    0.3490   -0.5240   -0.6980
  //   phi     0.0000    0.0000    0.6980    0.3492   -0.5240   -0.6980
  //     e     0.0000    0.0000    0.0000    0.0000    0.0000    0.0000
  //     f     0.0000    1.0000    0.6000    1.1000    1.0000    0.7000

  const getCos = (factor, angle) => factor * Math.cos(angle);
  const getSin = (factor, angle) => factor * Math.sin(angle);

  const f1 = affine.makeAffine2dFromCoeffs([ getCos(0.05, 0.0),    -getSin(0.6, 0.0),     0.0, getSin(0.05, 0.0),    getCos(0.6,  0.0),    0.0 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ getCos(0.05, 0.0),    -getSin(-0.5, 0.0),    0.0, getSin(0.05, 0.0),    getCos(-0.5, 0.0),    1.0 ]);
  const f3 = affine.makeAffine2dFromCoeffs([ getCos(0.6, 0.698),   -getSin(0.5, 0.698),   0.0, getSin(0.6, 0.698),   getCos(0.5, 0.698),   0.6 ]);
  const f4 = affine.makeAffine2dFromCoeffs([ getCos(0.5, 0.349),   -getSin(0.45, 0.3492), 0.0, getSin(0.5, 0.349),   getCos(0.45, 0.3492), 1.1 ]);
  const f5 = affine.makeAffine2dFromCoeffs([ getCos(0.5, -0.524),  -getSin(0.55, -0.524), 0.0, getSin(0.5, -0.524),  getCos(0.55, -0.524), 1.0 ]);
  const f6 = affine.makeAffine2dFromCoeffs([ getCos(0.55, -0.698), -getSin(0.4, -0.698),  0.0, getSin(0.55, -0.698), getCos(0.4, -0.698),  0.7 ]);

  return makeIfs([ f1, f2, f3, f4, f5, f6 ], [ 1/6, 1/6, 1/6, 1/6, 1/6, 1/6 ]);
};

export const TREE3_DOMAIN = { xmin: 0, xmax: 1, ymin: 0, ymax: 1 };
export const makeTree3 = () => {
  //       set 1     set 2     set 3     set 4     set 5
  // a     0.1950    0.4620   -0.6370   -0.0350   -0.0580
  // b    -0.4880    0.4140    0.0000    0.0700   -0.0700
  // c     0.3440   -0.2520    0.0000   -0.4690    0.4530
  // d     0.4430    0.3610    0.5010    0.0220   -0.1110
  // e     0.4431    0.2511    0.8562    0.4884    0.5976
  // f     0.2452    0.5692    0.2512    0.5069    0.0969

  const f1 = affine.makeAffine2dFromCoeffs([  0.195, -0.488, 0.4431,  0.344,  0.443, 0.2452 ]);
  const f2 = affine.makeAffine2dFromCoeffs([  0.462,  0.414, 0.2511, -0.252,  0.361, 0.5692 ]);
  const f3 = affine.makeAffine2dFromCoeffs([ -0.637,  0.0,   0.8562,  0.0,    0.501, 0.2512 ]);
  const f4 = affine.makeAffine2dFromCoeffs([ -0.035,  0.07,  0.4884, -0.469,  0.022, 0.5069 ]);
  const f5 = affine.makeAffine2dFromCoeffs([ -0.058, -0.07,  0.5976,  0.453, -0.111, 0.0969 ]);

  return makeIfs([ f1, f2, f3, f4, f5 ], [ 1/5, 1/5, 1/5, 1/5, 1/5 ]);
};

export const TREE4_DOMAIN = { xmin: -0.3, xmax: 0.3, ymin: -0.15, ymax: 0.45 };
export const makeTree4 = () => {
  // a      b      c      d       e     f       p
  // 0.000  0.000  0.000  0.600   0.00 -0.065   0.100
  // 0.440  0.000  0.000  0.550   0.00  0.200   0.180
  // 0.343 -0.248  0.199  0.429  -0.03  0.100   0.180
  // 0.343  0.248 -0.199  0.429   0.03  0.100   0.180
  // 0.280 -0.350  0.280  0.350  -0.05  0.000   0.180
  // 0.280  0.350 -0.280  0.350   0.05  0.000   0.180

  const f1 = affine.makeAffine2dFromCoeffs([ 0.0,    0.0,    0.0,   0.0,   0.6,  -0.065 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ 0.44,   0.0,    0.0,   0.0,   0.55,  0.2 ]);
  const f3 = affine.makeAffine2dFromCoeffs([ 0.343, -0.248, -0.03,  0.199, 0.429, 0.1 ]);
  const f4 = affine.makeAffine2dFromCoeffs([ 0.343,  0.248,  0.03, -0.199, 0.429, 0.1 ]);
  const f5 = affine.makeAffine2dFromCoeffs([ 0.28,  -0.35,  -0.05,  0.28,  0.35,  0.0 ]);
  const f6 = affine.makeAffine2dFromCoeffs([ 0.28,   0.35,   0.05, -0.28,  0.35,  0.0 ]);

  return makeIfs([ f1, f2, f3, f4, f5, f6 ], [ 0.1, 0.18, 0.18, 0.18, 0.18, 0.18 ]);
};

