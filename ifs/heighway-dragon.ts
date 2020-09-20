import { makeIfs } from './build';
import * as affine from '../utils/affine';

export const HEIGHWAY_DRAGON_DOMAIN = { xmin: -1/3, xmax: 7/6, ymin: -0.5, ymax: 1 };
export const makeHeighwayDragonIfs = () => {
  const scale = 1 / Math.SQRT2;
  const rotation = Math.PI / 4; // 45 degrees
  const reverseRotation = Math.PI - rotation; // 135 degrees

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(rotation),
    affine.scale(scale, scale),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1, 0),
    affine.reverseRotate(reverseRotation),
    affine.scale(scale, scale),
  ));
  return makeIfs([ f1, f2 ], [ 1/2, 1/2 ]);
};


export const TWIN_DRAGON_DOMAIN = { xmin: -1/3, xmax: 4/3, ymin: -1, ymax: 1 };
export const makeTwinDragonIfs = () => {
  const scale = 1 / Math.SQRT2;
  const rotation = Math.PI / 4; // 45 degrees

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(rotation),
    affine.scale(scale, scale),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/2, -1/2),
    affine.reverseRotate(rotation),
    affine.scale(scale, scale),
  ));
  return makeIfs([ f1, f2 ], [ 1/2, 1/2 ]);
};


export const TERDRAGON_DOMAIN = { xmin: -1/6, xmax: 7/6, ymin: -2/3, ymax: 2/3 };
export const makeTerdragonIfs = () => {
  const scale = 1 / Math.sqrt(3);

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(Math.PI/6), // 20 degrees
    affine.scale(scale, scale),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/2, Math.sqrt(3)/6),
    affine.reverseRotate(-Math.PI/2), // -90 degrees
    affine.scale(scale, scale),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/2, -Math.sqrt(3)/6),
    affine.reverseRotate(Math.PI/6), // 30 degrees
    affine.scale(scale, scale),
  ));
  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};

export const FUDGEFLAKE_DOMAIN = { xmin: -2/6, xmax: 7/6, ymin: -3/6, ymax: 7/6 };
export const makeFudgeFlake = () => {
  const scale = 1 / Math.sqrt(3);
  const rotation = Math.PI / 6; // 30 degrees

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(rotation),
    affine.scale(scale, scale),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/2, Math.sqrt(3)/6),
    affine.reverseRotate(rotation),
    affine.scale(scale, scale),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1/2, -Math.sqrt(3)/6),
    affine.reverseRotate(rotation),
    affine.scale(scale, scale),
  ));
  return makeIfs([ f1, f2, f3 ], [ 1/3, 1/3, 1/3 ]);
};

export const GOLDEN_DRAGON_DOMAIN = { xmin: -1/3, xmax: 7/6, ymin: -0.5, ymax: 1 };
export const makeGoldenDragonIfs = () => {
  const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
  const scale = Math.pow(1 / phi, 1 / phi); // 0.74274...
  const scaleSquared = scale * scale;

  const rotation1 = Math.acos((1 + scaleSquared - Math.pow(scale, 4)) / (2 * scale));// 32.893818... degrees
  const rotation2 = Math.PI - Math.acos((1 + Math.pow(scale, 4) - scaleSquared) / (2 * scaleSquared));// 133.0140178... degrees

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(rotation1),
    affine.scale(scale, scale),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1, 0),
    affine.reverseRotate(rotation2),
    affine.scale(scaleSquared, scaleSquared),
  ));
  return makeIfs([ f1, f2 ], [ 1/2, 1/2 ]);
};

export const Z2_HEIGHWAY_DRAGON_DOMAIN = { xmin: -2, xmax: 2, ymin: -2, ymax: 2 };
export const makeZ2HeighwayDragonIfs = () => {
  const scale = 1 / Math.SQRT2;
  const rotation = Math.PI / 4; // 45 degrees

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(rotation),
    affine.scale(scale, scale),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(-3 * rotation), // 135 degrees
    affine.scale(scale, scale),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1, 0),
    affine.reverseRotate(3 * rotation), // -135 degrees
    affine.scale(scale, scale),
  ));
  const f4 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(-1, 0),
    affine.reverseRotate(-rotation),
    affine.scale(scale, scale),
  ));
  return makeIfs([ f1, f2, f3, f4 ], [ 1/4, 1/4, 1/4, 1/4 ]);
};
