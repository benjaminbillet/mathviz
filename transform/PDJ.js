import { complex } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makePDJFunction = (a, b, c, d) => {
  return (z) => complex(math.sin(a * z.im) - math.cos(b * z.re), math.sin(c * z.re) - math.cos(d * z.im));
};

export const makePDJ = () => {
  const a = randomScalar(0, 2 * Math.PI);
  const b = randomScalar(0, 2 * Math.PI);
  const c = randomScalar(0, 2 * Math.PI);
  const d = randomScalar(0, 2 * Math.PI);
  console.log(`makePDJFunction(${a}, ${b}, ${c}, ${d})`);
  return makePDJFunction(a, b, c, d);
};
