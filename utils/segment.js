import { sub, mul, add } from './complex';

export const moveTowards = (from, to, distanceFactor = 0.5) => {
  let z = sub(to, from);
  z = mul(z, distanceFactor, z);
  return add(z, from, z);
};
