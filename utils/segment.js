import { sub, mul, add, div, modulus, equals } from './complex';

export const moveTowards = (from, to, distanceFactor = 0.5) => {
  let z = sub(to, from);
  z = mul(z, distanceFactor, z);
  return add(z, from, z);
};

export const moveTowardsAbs = (from, to, distance = 0.5) => {
  if (equals(from, to)) {
    return from;
  }

  let z = sub(to, from);
  z = div(z, modulus(z), z); // normalize
  z = mul(z, distance, z);
  return add(z, from, z);
};
