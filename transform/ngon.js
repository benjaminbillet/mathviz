import { complex, modulus } from '../utils/complex';

import { randomScalar } from '../utils/random';
import math from '../utils/math';

export const makeNgonFunction = (power, sides, corners, circle) => {
  const piOverSides = Math.PI / sides;
  const twoPiOverSides = 2 * piOverSides;
  return (z) => {
    const bigTheta = math.atan2(z.re, z.im);
    const t1 = bigTheta - twoPiOverSides * Math.floor(bigTheta / twoPiOverSides);
    let t2 = t1;
    if (t1 <= piOverSides) {
      t2 = t1 - twoPiOverSides;
    }

    const factor = (corners * ((1 / math.cos(t2)) - 1) + circle) / (Math.pow(modulus(z), power));
    return complex(factor * z.re, factor * z.im);
  };
};

export const makeNgon = () => {
  const power = randomScalar(1, 10);
  const sides = randomScalar(1, 10);
  const corners = randomScalar(-1, 1);
  const circle = randomScalar(-1, 1);
  console.log(`makeNgonFunction(${power}, ${sides}, ${corners}, ${circle})`);
  return makeNgonFunction(power, sides, corners, circle);
};
