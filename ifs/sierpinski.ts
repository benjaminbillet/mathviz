import { makeIfs } from './build';
import affine from '../utils/affine';
import { Optional } from '../utils/types';

export const SIERPINSKI_TRIANGLE_DOMAIN = { xmin: 0, xmax: 1, ymin: 0, ymax: 1 };
export const makeSierpinskiTriangle = () => {
  const f1 = affine.makeAffine2dFromMatrix(affine.scale(1/2, 1/2));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/2, 0),
    affine.scale(1/2, 1/2),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/4, Math.sqrt(3)/4),
    affine.scale(1/2, 1/2),
  ));
  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};

export const SIERPINSKI_CARPET_DOMAIN = { xmin: 0, xmax: 1, ymin: 0, ymax: 1 };
export const makeSierpinskiCarpet = () => {
  const f1 = affine.makeAffine2dFromMatrix(affine.scale(1/3, 1/3));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0, 1/3),
    affine.scale(1/3, 1/3),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0, 2/3),
    affine.scale(1/3, 1/3),
  ));
  const f4 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/3, 0),
    affine.scale(1/3, 1/3),
  ));
  const f5 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/3, 2/3),
    affine.scale(1/3, 1/3),
  ));
  const f6 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(2/3, 0),
    affine.scale(1/3, 1/3),
  ));
  const f7 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(2/3, 1/3),
    affine.scale(1/3, 1/3),
  ));
  const f8 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(2/3, 2/3),
    affine.scale(1/3, 1/3),
  ));
  return makeIfs([ f1, f2, f3, f4, f5, f6, f7, f8 ], [ 1/8, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8, 1/8 ]);
};

export const SIERPINSKI_PEDAL_TRIANGLE_DOMAIN = { xmin: 0, xmax: 1, ymin: 0, ymax: 1 };
export const makeSierpinskiPedalTriangle = (angleA = 1.135, angleB = 0.872, angleC = 1.135) => {
  const cosA = Math.cos(angleA);
  const cosB = Math.cos(angleB);
  const cosC = Math.cos(angleC);
  const sinC = Math.sin(angleC);

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(angleB),
    affine.reflect(false, true),
    affine.scale(cosB, cosB),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(sinC * sinC, cosC * sinC),
    affine.reverseRotate(-angleC),
    affine.reflect(false, true),
    affine.scale(cosC, cosC),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(sinC * sinC, cosC * sinC),
    affine.reverseRotate(angleB - angleC),
    affine.reflect(true, false),
    affine.scale(cosA, cosA),
  ));
  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};


export const SIERPINSKI_PENTAGON_DOMAIN = { xmin: -0.5, xmax: 1.5, ymin: 0, ymax: 2 };
export const makeSierpinskiPentagon = () => {
  const r = (3 - Math.sqrt(5)) / 2;

  const f1 = affine.makeAffine2dFromMatrix(affine.scale(r, r));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.618, 0),
    affine.scale(r, r),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.809, 0.588),
    affine.scale(r, r),
  ));
  const f4 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.309, 0.951),
    affine.scale(r, r),
  ));
  const f5 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(-0.191, 0.588),
    affine.scale(r, r),
  ));

  return makeIfs([ f1, f2, f3, f4, f5 ], [ 1/5, 1/5, 1/5, 1/5, 1/5 ]);
};

export const SIERPINSKI_NGON_DOMAIN = { xmin: -1, xmax: 1, ymin: -1, ymax: 1 };
export const makeSierpinskiNGon = (n: number, s?: Optional<number>) => {
  const k = Math.trunc(n / 4);
  if (s == null) {
    s = 0;
    for (let i = 1; i <= k; i++) {
      s += Math.cos(2 * Math.PI * i / n);
    }
    s = 1 / (2 * (1 + s));
  }

  const functions = [];
  for (let i = 1; i <= n; i++) {
    const twoPiKOverN = 2 * Math.PI * i / n;
    const f = affine.makeAffine2dFromMatrix(affine.combine(
      affine.translate((1 - s) * Math.cos(twoPiKOverN), (1 - s) * Math.sin(twoPiKOverN)),
      affine.scale(s, s),
    ));
    functions.push(f);
  }

  return makeIfs(functions, functions.map(() => 1/functions.length));
};

