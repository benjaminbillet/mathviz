import { ComplexNumber } from './complex';

export const moveTowards = (from: ComplexNumber, to: ComplexNumber, distanceFactor = 0.5) => {
  const z = to.sub(from);
  return z.mul(distanceFactor, z).add(from, z);
};

export const moveTowardsAbs = (from: ComplexNumber, to: ComplexNumber, distance = 0.5) => {
  if (from.equals(to)) {
    return from;
  }

  const z = to.sub(from);
  return z.normalize(z).mul(distance, z).add(from, z);
};
