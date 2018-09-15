import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makeNgonFunction = (power, sides, corners, circle) => {
  const piOverSides = Math.PI / sides;
  const twoPiOverSides = 2 * piOverSides;
  return (z) => {
    const bigTheta = Math.atan2(z.im, z.re);
    const t1 = bigTheta - twoPiOverSides * Math.floor(bigTheta / twoPiOverSides);
    let t2 = t1;
    if (t1 <= piOverSides) {
      t2 = t1 - twoPiOverSides;
    }

    const factor = (corners * ((1 / Math.cos(t2)) - 1) + circle) / (Math.pow(z.abs(), power));
    return new Complex(factor * z.re, factor * z.im);
  };
};

export const makeNgon = (file) => {
  const power = randomScalar(1, 10);
  const sides = randomScalar(1, 10);
  const corners = randomScalar(-1, 1);
  const circle = randomScalar(-1, 1);
  fs.appendFileSync(file, `makeNgonFunction(${power}, ${sides}, ${corners}, ${circle})\n`);
  return makeNgonFunction(power, sides, corners, circle);
};
