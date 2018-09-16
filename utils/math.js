import * as approx from './approx';

const mathFull = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  atan2: Math.atan2,
  sqrt: Math.sqrt,
};

const mathApprox = {
  sin: approx.sin,
  cos: approx.cos,
  tan: approx.tan,
  atan2: approx.atan2,
  sqrt: approx.sqrt,
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

