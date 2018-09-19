
import { makeAffine2dFromCoeffs } from '../utils/affine';
import { randomScalar } from '../utils/random';

export const makeLinearFunction = (a, b, c, d, e, f) => {
  return makeAffine2dFromCoeffs([ a, b, c, d, e, f ]);
};

export const makeLinear = () => {
  const a = randomScalar(-1, 1);
  const b = randomScalar(-1, 1);
  const c = randomScalar(-1, 1);
  const d = randomScalar(-1, 1);
  const e = randomScalar(-1, 1);
  const f = randomScalar(-1, 1);
  console.log(`makeLinearFunction(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`);
  return makeLinearFunction(a, b, c, d, e, f);
};
