import { complex } from '../utils/complex';
import mathmatrix, { matrix } from 'mathjs';
import math from '../utils/math';

export const applyAffine2dFromMatrix = (matrix, z) => {
  const a11 = matrix.get([ 0, 0 ]);
  const a12 = matrix.get([ 0, 1 ]);
  const a13 = matrix.get([ 0, 2 ]);
  const a21 = matrix.get([ 1, 0 ]);
  const a22 = matrix.get([ 1, 1 ]);
  const a23 = matrix.get([ 1, 2 ]);
  return complex(a11 * z.re + a12 * z.im + a13, a21 * z.re + a22 * z.im + a23);
};

export const makeAffine2dFromCoeffs = (coeffs) => {
  return (z) => complex(coeffs[0] * z.re + coeffs[1] * z.im + coeffs[2], coeffs[3] * z.re + coeffs[4] * z.im + coeffs[5]);
};

export const makeAffine2dFromMatrix = (matrix) => {
  const a11 = matrix.get([ 0, 0 ]);
  const a12 = matrix.get([ 0, 1 ]);
  const a13 = matrix.get([ 0, 2 ]);
  const a21 = matrix.get([ 1, 0 ]);
  const a22 = matrix.get([ 1, 1 ]);
  const a23 = matrix.get([ 1, 2 ]);
  return (z) => complex(a11 * z.re + a12 * z.im + a13, a21 * z.re + a22 * z.im + a23);
};

export const identity = () => {
  return matrix([
    [ 1, 0, 0 ],
    [ 0, 1, 0 ],
    [ 0, 0, 1 ],
  ]);
};
export const IDENTITY = identity();

export const scale = (x = 1, y = 1) => {
  return matrix([
    [ x, 0, 0 ],
    [ 0, y, 0 ],
    [ 0, 0, 1 ],
  ]);
};

export const homogeneousScale = (s = 1) => {
  return scale(s, s);
};

export const rotate = (angle) => { // clockwise
  const cos = math.cos(angle);
  const sin = math.sin(angle);
  return matrix([
    [ cos,  sin, 0 ],
    [ -sin, cos, 0 ],
    [ 0,    0,   1 ],
  ]);
};

export const reverseRotate = (angle) => { // counter clockwise
  const cos = math.cos(angle);
  const sin = math.sin(angle);
  return matrix([
    [ cos, -sin, 0 ],
    [ sin,  cos, 0 ],
    [ 0,    0,   1 ],
  ]);
};

export const translate = (x = 0, y = 0) => {
  return matrix([
    [ 1, 0, x ],
    [ 0, 1, y ],
    [ 0, 0, 1 ],
  ]);
};

export const shear = (x = 0, y = 0) => {
  x = math.tan(x);
  y = math.tan(y);
  return matrix([
    [ 1, x, 0 ],
    [ y, 1, 0 ],
    [ 0, 0, 1 ],
  ]);
};

export const reflect = (horizontal = true, vertical = true) => {
  let x = 1;
  let y = 1;
  if (horizontal) {
    x = 1;
    y = -1;
  } else if (vertical) {
    x = -1;
    y = 1;
  }
  return matrix([
    [ y, 0, 0 ],
    [ 0, x, 0 ],
    [ 0, 0, 1 ],
  ]);
};

export const reflectAlong = (angle) => {
  const m = math.tan(angle - Math.PI / 2);
  const mm = m * m;
  const c = 1 / (1 + mm);
  return matrix([
    [ c * (1 - mm), c * ( 2 * m), 0 ],
    [ c * (2 * m),  c * (mm - 1), 0 ],
    [ 0,            0,            1 ],
  ]);
};

export const combine = (...matrices) => {
  return matrices.reduce((result, m) => mathmatrix.multiply(result, m), identity(3));
};
