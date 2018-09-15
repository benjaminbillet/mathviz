import Complex from 'complex.js';
import fs from 'fs';
import { randomScalar } from '../utils/random';

export const makePerspectiveFunction = (angle, depth) => {
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  return (z) => {
    const factor = depth / (depth - z.im * sinAngle);
    return new Complex(factor * z.re, factor * z.im * cosAngle);
  };
};

export const makePerspective = (file) => {
  const depth = randomScalar(0.01, 50);
  const angle = randomScalar(0, Math.PI * 2);
  fs.appendFileSync(file, `makePerspectiveFunction(${depth}, ${angle})\n`);
  return makePerspectiveFunction(depth, angle);
};
