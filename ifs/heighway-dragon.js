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
  return makeIfs([f1, f2], [1/2, 1/2]);
};

export const GOLDEN_DRAGON_DOMAIN = { xmin: -1/3, xmax: 7/6, ymin: -0.5, ymax: 1 };
export const makeGoldenDragonIfs = () => {
  const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
  const scale = Math.pow(1 / phi, 1 / phi); // 0.74274... 
  const scaleSquared = scale * scale;

  const rotation1 = Math.acos((1 + scaleSquared - Math.pow(scale, 4)) / (2 * scale)); // 32.893818... degrees
  const rotation2 = Math.PI - Math.acos((1 + Math.pow(scale, 4) - scaleSquared) / (2 * scaleSquared)); // 133.0140178... degrees

  const f1 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.reverseRotate(rotation1),
    affine.scale(scale, scale),
  )); 
  const f2 = affine.makeAffine2dFromMatrix(affine.combine(
    affine.translate(1, 0),
    affine.reverseRotate(rotation2),
    affine.scale(scaleSquared, scaleSquared),
  )); 
  return makeIfs([f1, f2], [1/2, 1/2]);
};
