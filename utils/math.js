import * as approx from './approx';

const mathFull = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  atan2: Math.atan2,
  sqrt: Math.sqrt,
  sign: Math.sign,
  min: Math.min,
  max: Math.max,
};

const mathApprox = {
  sin: approx.sin,
  cos: approx.cos,
  tan: approx.tan,
  atan2: approx.atan2,
  sqrt: approx.sqrt,
  sign: Math.sign,
  min: Math.min,
  max: Math.max,
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

export const toRadian = (degrees) => {
  return degrees * Math.PI / 180;
};

export const toDegree = (radian) => {
  return radian * 180 / Math.PI;
};
