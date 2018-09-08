import Complex from 'complex.js';
import { randomScalar } from '../utils/random';

export const makePerspective = (angle, depth) => {
  depth = depth == null ? randomScalar(0.01, 50) : depth;
  angle = angle == null ? randomScalar(0, Math.PI * 2) : angle;
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  return (z) => {
    const factor = depth / (depth - z.im * sinAngle);
    return new Complex(factor * z.re, factor * z.im * cosAngle);
  };
};
