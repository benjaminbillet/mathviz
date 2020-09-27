import { complex, ComplexNumber } from '../utils/complex';
import mathmatrix, { matrix, Matrix } from 'mathjs';
import math from '../utils/math';
import { Affine2D } from './types';

export const applyAffine2dFromMatrix = (matrix: Matrix, z: ComplexNumber) => {
  const a11 = matrix.get([ 0, 0 ]);
  const a12 = matrix.get([ 0, 1 ]);
  const a13 = matrix.get([ 0, 2 ]);
  const a21 = matrix.get([ 1, 0 ]);
  const a22 = matrix.get([ 1, 1 ]);
  const a23 = matrix.get([ 1, 2 ]);
  return complex(a11 * z.re + a12 * z.im + a13, a21 * z.re + a22 * z.im + a23);
};

export const applyAffine2dFromCoeffs = ([ a11, a12, a13, a21, a22, a23 ]: number[], z: ComplexNumber): ComplexNumber => {
  return complex(a11 * z.re + a12 * z.im + a13, a21 * z.re + a22 * z.im + a23);
};

export const makeAffine2dFromCoeffs = ([ a11, a12, a13, a21, a22, a23 ]: number[]): Affine2D => {
  return (z) => complex(a11 * z.re + a12 * z.im + a13, a21 * z.re + a22 * z.im + a23);
};

export const makeAffine2dFromMatrix = (matrix: Matrix): Affine2D => {
  const a11 = matrix.get([ 0, 0 ]);
  const a12 = matrix.get([ 0, 1 ]);
  const a13 = matrix.get([ 0, 2 ]);
  const a21 = matrix.get([ 1, 0 ]);
  const a22 = matrix.get([ 1, 1 ]);
  const a23 = matrix.get([ 1, 2 ]);
  return (z) => complex(a11 * z.re + a12 * z.im + a13, a21 * z.re + a22 * z.im + a23);
};

export const getCoeffsFromMatrix = (matrix: Matrix, out?: Float32Array): Float32Array => {
  if (out == null) {
    out = new Float32Array(6);
  }
  out[0] = matrix.get([ 0, 0 ]);
  out[1] = matrix.get([ 0, 1 ]);
  out[2] = matrix.get([ 0, 2 ]);
  out[3] = matrix.get([ 1, 0 ]);
  out[4] = matrix.get([ 1, 1 ]);
  out[5] = matrix.get([ 1, 2 ]);
  return out;
};

export const identity = () => {
  return matrix([
    [ 1, 0, 0 ],
    [ 0, 1, 0 ],
    [ 0, 0, 1 ],
  ]);
};
export const IDENTITY = identity();
export const IDENTITY_FUNC: Affine2D = z => z;

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

export const rotate = (angle: number) => { // clockwise
  const cos = math.cos(angle);
  const sin = math.sin(angle);
  return matrix([
    [ cos,  sin, 0 ],
    [ -sin, cos, 0 ],
    [ 0,    0,   1 ],
  ]);
};

export const reverseRotate = (angle: number) => { // counter clockwise
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

export const reflectAlong = (angle: number) => {
  const m = math.tan(angle - Math.PI / 2);
  const mm = m * m;
  const c = 1 / (1 + mm);
  return matrix([
    [ c * (1 - mm), c * ( 2 * m), 0 ],
    [ c * (2 * m),  c * (mm - 1), 0 ],
    [ 0,            0,            1 ],
  ]);
};

export const combine = (...matrices: Matrix[]) => {
  return matrices.reduce((result, m) => mathmatrix.multiply(result, m), identity());
};

export default {
  applyAffine2dFromMatrix,
  applyAffine2dFromCoeffs,
  makeAffine2dFromCoeffs,
  makeAffine2dFromMatrix,
  getCoeffsFromMatrix,
  identity,
  scale,
  homogeneousScale,
  rotate,
  reverseRotate,
  translate,
  shear,
  reflect,
  reflectAlong,
  combine,
};