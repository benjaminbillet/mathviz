import { makeAffine2dFromCoeffs } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeLinear = (a, b, c, d, e, f) => {
  a = a == null ? randomScalar(-1, 1) : a;
  b = b == null ? randomScalar(-1, 1) : b;
  c = c == null ? randomScalar(-1, 1) : c;
  d = d == null ? randomScalar(-1, 1) : d;
  e = e == null ? randomScalar(-1, 1) : e;
  f = f == null ? randomScalar(-1, 1) : f;
  return makeAffine2dFromCoeffs([a, b, c, d, e, f]);
};
