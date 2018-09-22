import { makeIfs } from './build';
import * as affine from '../utils/affine';

export const MCCORTER_PENTIGREE_DOMAIN = { xmin: -0.2, xmax: 1.2, ymin: -0.4, ymax: 1 };
export const makeMcCorterPentigree = () => {
  const r = (3 - Math.sqrt(5)) / 2;
  const rotation1 = 0.628319; // 36 degrees
  const rotation2 = 1.88496; // 108 degrees

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(rotation1),
    affine.scale(r, r),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.309, 0.225),
    affine.reverseRotate(rotation2),
    affine.scale(r, r),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.191, 0.588),
    affine.reverseRotate(-rotation1),
    affine.scale(r, r),
  ));
  const f4 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.5, 0.363),
    affine.reverseRotate(-rotation2),
    affine.scale(r, r),
  ));
  const f5 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.382, 0),
    affine.reverseRotate(-rotation1),
    affine.scale(r, r),
  ));
  const f6 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.691, -0.225),
    affine.reverseRotate(rotation1),
    affine.scale(r, r),
  ));
  return makeIfs([ f1, f2, f3, f4, f5, f6 ], [ 1/6, 1/6, 1/6, 1/6, 1/6, 1/6 ]);
};

export const MCCORTER_PENTIGREE_2NDFORM_DOMAIN = { xmin: -1.2, xmax: 1.2, ymin: -1.2, ymax: 1.2 };
export const makeMcCorterPentigree2ndForm = () => {
  const r = (3 - Math.sqrt(5)) / 2;
  const rotation = 0.628319; // 36 degrees

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.727, 0),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.225, 0.691),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f4 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(-0.588, 0.427),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f5 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(-0.588, -0.427),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f6 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.225, -0.691),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  return makeIfs([ f1, f2, f3, f4, f5, f6 ], [ 1/6, 1/6, 1/6, 1/6, 1/6, 1/6 ]);
};

export const PENTADENDRITE_2NDFORM_DOMAIN = { xmin: -1.2, xmax: 1.2, ymin: -1.2, ymax: 1.2 };
export const makePentadentrite2ndForm = () => {
  const r = (3 - Math.sqrt(5)) / 2;
  const rotation = 0.20629792; // 11.82 degrees

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.649, 0.136),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f3 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.071, 0.659),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f4 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(-0.604, 0.271),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f5 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(-0.445, -0.491),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  const f6 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(0.330, -0.575),
    affine.reverseRotate(rotation),
    affine.scale(r, r),
  ));
  return makeIfs([ f1, f2, f3, f4, f5, f6 ], [ 1/6, 1/6, 1/6, 1/6, 1/6, 1/6 ]);
};
