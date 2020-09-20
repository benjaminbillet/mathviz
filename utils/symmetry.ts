import affine from '../utils/affine';
import { Affine2D } from './types';

export const makeCyclicSymmetry = (degree: number) => {
  const transforms: Affine2D[] = [];
  if (degree === 0) {
    return transforms;
  }

  const step = 2 * Math.PI / degree;
  for (let i = 1; i < degree; i++) {
    transforms.push(affine.makeAffine2dFromMatrix(affine.rotate(step * i)));
  }
  return transforms;
};

export const makeDihedralSymmetry = (degree: number) => {
  const transforms: Affine2D[] = [];
  if (degree === 0) {
    return transforms;
  }

  const step = Math.PI / degree;
  transforms.push(affine.makeAffine2dFromMatrix(affine.reflectAlong(0)));
  for (let i = 1; i < degree; i++) {
    transforms.push(affine.makeAffine2dFromMatrix(affine.reflectAlong(step * i)));
    transforms.push(affine.makeAffine2dFromMatrix(affine.combine(affine.reflectAlong(0), affine.reflectAlong(step * i))));
  }

  return transforms;
};
