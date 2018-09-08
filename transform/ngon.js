import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makeNgon = (power, sides, corners, circle) => {
  power = power == null ? randomScalar(1, 10) : power;
  sides = sides == null ? randomScalar(1, 10) : sides;
  corners = corners == null ? randomScalar(-1, 1) : corners;
  circle = circle == null ? randomScalar(-1, 1) : circle;

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

