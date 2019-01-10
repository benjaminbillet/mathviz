import * as approx from './approx';
import { mulberry32, makeMulberry32 } from './random';

const mathFull = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  atan2: Math.atan2,
  sqrt: Math.sqrt,
  random: mulberry32,
};

const mathApprox = {
  sin: approx.sin,
  cos: approx.cos,
  tan: approx.tan,
  atan2: approx.atan2,
  sqrt: approx.sqrt,
  random: mulberry32,
};

let currentMath = Object.assign({}, mathFull);
export default currentMath;

export const enableMathApprox = () => {
  Object.keys(mathApprox).forEach((key) => {
    currentMath[key] = mathApprox[key];
  });
};

export const enableMathFull = () => {
  Object.keys(mathFull).forEach((key) => {
    currentMath[key] = mathFull[key];
  });
};

export const setRandomSeed = (seed) => {
  mathFull.random = makeMulberry32(seed);
  mathApprox.random = mathFull.random;
};

export const toRadian = (degrees) => {
  return degrees * Math.PI / 180;
};

export const toDegree = (radian) => {
  return radian * 180 / Math.PI;
};
