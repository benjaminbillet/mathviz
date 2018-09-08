import { randomComplex } from "../utils/random";

export const makeMobius = (a, b, c, d) => {
  a = a == null ? randomComplex(-1, 1) : a;
  b = b == null ? randomComplex(-1, 1) : b;
  c = c == null ? randomComplex(-1, 1) : c;
  d = d == null ? randomComplex(-1, 1) : d;
  return (z) => {
    const numerator = z.mul(a).add(b);
    const denominator = z.mul(c).add(d);
    return numerator.div(denominator);
  };
};
