import { complex } from '../utils/complex';

import { randomScalar } from '../utils/random';

export const makeTriangleFunction = (r) => {
  const halfR = r / 2;
  return (z) => complex(z.re * (r - halfR * z.im), z.im * (r - halfR * z.re));
};

export const makeTriangle = () => {
  const r = randomScalar(0.5, 1.5);
  console.log(`makeTriangleFunction(${r})`);
  return makeTriangleFunction(r);
};
