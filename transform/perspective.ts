import { complex } from '../utils/complex';

import math from '../utils/math';
import { randomScalar } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makePerspectiveFunction = (angle: number, depth: number): Transform2D => {
  const cosAngle = math.cos(angle);
  const sinAngle = math.sin(angle);
  return (z) => {
    const factor = depth / (depth - z.im * sinAngle);
    return complex(factor * z.re, factor * z.im * cosAngle);
  };
};

export const makePerspective = () => {
  const depth = randomScalar(0.01, 50);
  const angle = randomScalar(0, Math.PI * 2);
  console.log(`makePerspectiveFunction(${depth}, ${angle})`);
  return makePerspectiveFunction(depth, angle);
};
