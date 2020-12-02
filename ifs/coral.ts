import { makeIfs } from './build';
import affine from '../utils/affine';


export const CORAL1_DOMAIN = { xmin: -6, xmax: 6, ymin: -1, ymax: 11 };
export const makeCoral1 = () => {
  // a         b         c          d          e         f          p
  // 0.307692 -0.531469 -0.461538  -0.293706   5.401953  8.655175   0.40
  // 0.307692 -0.076923  0.153846  -0.447552  -1.295248  4.152990   0.15
  // 0.000000  0.545455  0.692308  -0.195804  -4.893637  7.269794   0.45

  const f1 = affine.makeAffine2dFromCoeffs([ 0.307692, -0.531469,  5.401953, -0.461538, -0.293706, 8.655175 ]);
  const f2 = affine.makeAffine2dFromCoeffs([ 0.307692, -0.076923, -1.295248,  0.153846, -0.447552, 4.152990 ]);
  const f3 = affine.makeAffine2dFromCoeffs([ 0.0,       0.545455, -4.893637,  0.692308, -0.195804, 7.269794 ]);
  return makeIfs([ f1, f2, f3 ], [ 0.4, 0.15, 0.45 ]);
};
