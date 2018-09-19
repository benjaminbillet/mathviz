import Complex from 'complex.js';

import { randomScalar } from '../utils/random';

export const makePerspectiveFunction = (angle, depth) => {
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  return (z) => {
    const factor = depth / (depth - z.im * sinAngle);
    return new Complex(factor * z.re, factor * z.im * cosAngle);
  };
};

export const makePerspective = () => {
  const depth = randomScalar(0.01, 50);
  const angle = randomScalar(0, Math.PI * 2);
  console.log(`makePerspectiveFunction(${depth}, ${angle})`);
  return makePerspectiveFunction(depth, angle);
};
