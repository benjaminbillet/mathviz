// The Koch curve is an IFS composed of four affine function, each function controlling an aspect of the curve:
// - f1: scale by 1/3
// - f2: scale by 1/3, translate 1/3 right, rotate 60 degrees 
// - f3: scale by 1/3, translate 1/2 right and √3/6 up, rotate -60 degrees
// - f4: scale by r, translate 2/3 right

import { makeIfs } from './build';
import * as affine from '../utils/affine';

export const KOCH_CURVE_DOMAIN = { xmin: 0, xmax: 1, ymin: 0, ymax: 1}
export const makeKochCurveIfs = () => {
  const f1 = affine.makeAffine2dFromMatrix(affine.scale(1/3, 1/3));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/3, 0),
    affine.reverseRotate(Math.PI / 3), // 60 degrees
    affine.scale(1/3, 1/3),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/2, Math.sqrt(3)/6),
    affine.reverseRotate(-Math.PI / 3), // -60 degrees
    affine.scale(1/3, 1/3),
  ));
  const f4 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(2/3, 0),
    affine.scale(1/3, 1/3),
  ));
  return makeIfs([f1, f2, f3, f4], [1/4, 1/4, 1/4, 1/4]);
};


export const KOCH_FLAKE_DOMAIN = { xmin: -1, xmax: 1, ymin: -1, ymax: 1}
export const makeKochFlakeIfs = () => {
  const sqrt3 = Math.sqrt(3);

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(Math.PI/6), // 30 degrees
    affine.scale(1/sqrt3, 1/sqrt3),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/sqrt3, 1/3),
    affine.scale(1/3, 1/3),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0, 2/3),
    affine.scale(1/3, 1/3),
  ));
  const f4 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(-1/sqrt3, 1/3),
    affine.scale(1/3, 1/3),
  ));
  const f5 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(-1/sqrt3, -1/3),
    affine.scale(1/3, 1/3),
  ));
  const f6 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0, -2/3),
    affine.scale(1/3, 1/3),
  ));
  const f7 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/sqrt3, -1/3),
    affine.scale(1/3, 1/3),
  ));
  
  return makeIfs([f1, f2, f3, f4, f5, f6, f7], [1/7, 1/7, 1/7, 1/7, 1/7, 1/7, 1/7]);
};

/*export const FLOWSNAKE_DOMAIN = { xmin: -0.1, xmax: 1.1, ymin: -0.3, ymax: 0.9}
export const makeFlowsnakeIfs = () => {
  const sqrt3 = Math.sqrt(3);
  const sqrt7 = Math.sqrt(7);

  const scale = 1/sqrt7;
  const rotation1 = Math.asin(sqrt3 / (2 * sqrt7)); // 19.1066... degrees
  const rotation2 = rotation1 - (Math.PI * 2 / 3); // rotation - 120 degrees
  const rotation3 = rotation1 + (Math.PI * 2 / 3); // rotation + 120 degrees

  const f1 = affine.makeAffine2dFromMatrix(applyScale(applyTranslation(applyRotation(AFFINE_IDENTITY, rotation2), 1/14, 3*sqrt3/14), scale, scale));
  const f2 = affine.makeAffine2dFromMatrix(applyScale(applyTranslation(applyRotation(AFFINE_IDENTITY, rotation1), 1/14, 3*sqrt3/14), scale, scale));
  const f3 = affine.makeAffine2dFromMatrix(applyScale(applyTranslation(applyRotation(AFFINE_IDENTITY, rotation1), 3/7, 2*sqrt3/7), scale, scale));
  const f4 = affine.makeAffine2dFromMatrix(applyScale(applyTranslation(applyRotation(AFFINE_IDENTITY, rotation2), 11/14, 5*sqrt3/14), scale, scale));
  const f5 = affine.makeAffine2dFromMatrix(applyScale(applyTranslation(applyRotation(AFFINE_IDENTITY, rotation1), 5/14, sqrt3/14), scale, scale));
  const f6 = affine.makeAffine2dFromMatrix(applyScale(applyTranslation(applyRotation(AFFINE_IDENTITY, rotation3), 9/14, -sqrt3/14), scale, scale));
  const f7 = affine.makeAffine2dFromMatrix(applyScale(applyTranslation(applyRotation(AFFINE_IDENTITY, rotation1), 9/14, -sqrt3/14), scale, scale));

  return makeIfs([f1, f2, f3, f4, f5, f6, f7], [1/7, 1/7, 1/7, 1/7, 1/7, 1/7, 1/7]);
};*/


export const KOCH_ANTIFLAKE_DOMAIN = { xmin: 0, xmax: 1, ymin: 0, ymax: 1}
export const makeKochAntiFlakeIfs = () => {
  const sqrt3 = Math.sqrt(3);

  const f1 = affine.makeAffine2dFromMatrix(affine.scale(1/3, 1/3));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/3, sqrt3/3),
    affine.scale(1/3, 1/3),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(2/3, 0),
    affine.scale(1/3, 1/3),
  ));

  const f4 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/2, sqrt3/6),
    affine.reverseRotate(Math.PI),
    affine.scale(1/3, 1/3),
  ));
  const f5 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(5/6, sqrt3/6),
    affine.reverseRotate(Math.PI),
    affine.scale(1/3, 1/3),
  ));
  const f6 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(2/3, sqrt3/3),
    affine.reverseRotate(Math.PI),
    affine.scale(1/3, 1/3),
  ));

  return makeIfs([f1, f2, f3, f4, f5, f6], [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]);
};
