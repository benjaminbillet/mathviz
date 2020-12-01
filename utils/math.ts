import * as approx from './approx';

export const TWO_PI = Math.PI * 2;
export const SQRT_TWO_PI = Math.sqrt(Math.PI * 2);

const mathFull = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  atan2: Math.atan2,
  sqrt: Math.sqrt,
  log: Math.log,
  log10: Math.log10,
  log2: Math.log2,
  sign: Math.sign,
  min: Math.min,
  max: Math.max,
  mod: (n: number, m: number) => ((n % m) + m) % m,
};

const mathApprox = {
  sin: approx.sin,
  cos: approx.cos,
  tan: approx.tan,
  atan2: approx.atan2,
  sqrt: approx.sqrt,
  log: approx.log,
  log10: approx.log10,
  log2: approx.log2,
  sign: Math.sign,
  min: Math.min,
  max: Math.max,
  mod: mathFull.mod,
};

const currentMath = Object.assign({}, mathFull);
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

export const toRadian = (degrees: number) => {
  return degrees * Math.PI / 180;
};

export const toDegree = (radian: number) => {
  return radian * 180 / Math.PI;
};
