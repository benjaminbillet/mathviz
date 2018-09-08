import Complex from 'complex.js';
import math, { matrix } from 'mathjs';


export const makeAffine2dFromCoeffs = (coeffs) => {
  return (z) => new Complex(coeffs[0] * z.re + coeffs[1] * z.im + coeffs[2], coeffs[3] * z.re + coeffs[4] * z.im + coeffs[5]);
};

export const makeAffine2dFromMatrix = (matrix) => {
  const a11 = matrix.get([0, 0]);
  const a12 = matrix.get([0, 1]);
  const a13 = matrix.get([0, 2]);
  const a21 = matrix.get([1, 0]);
  const a22 = matrix.get([1, 1]);
  const a23 = matrix.get([1, 2]);
  console.log (a11, a12, a13, a21, a22, a23)
  return (z) => new Complex(a11 * z.re + a12 * z.im + a13, a21 * z.re + a22 * z.im + a23);
};

export const scale = (x = 1, y = 1) => {
  return matrix([
    [x, 0, 0],
    [0, y, 0],
    [0, 0, 1],
  ]);
};

export const rotate = (angle) => { // clockwise
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return matrix([
    [cos,  sin, 0],
    [-sin, cos, 0],
    [0,    0,   1],
  ]);
};

export const reverseRotate = (angle) => { // counter clockwise
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return matrix([
    [cos, -sin, 0],
    [sin,  cos, 0],
    [0,    0,   1],
  ]);
};

export const translate = (x = 0, y = 0) => {
  return matrix([
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1],
  ]);
};

export const shear = (x = 0, y = 0) => {
  x = Math.tan(x);
  y = Math.tan(y);
  return matrix([
    [1, x, 0],
    [y, 1, 0],
    [0, 0, 1],
  ]);
};

export const reflect = (x = true, y = true) => {
  x = x ? -1 : 1;
  y = y ? -1 : 1;
  return matrix([
    [y, 0, 0],
    [0, x, 0],
    [0, 0, 1],
  ]);
};

export const combine = (...matrices) => {
  return matrices.reduce((result, m) => math.multiply(result, m), math.identity(3));
};
