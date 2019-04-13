import assert from 'assert';

import { modulus, powN, add, sub, complex, mul } from '../utils/complex';

// http://usefuljs.net/fractals/docs/rational_maps.html
export const rationalMap = (z0, c, lambda, p = 2, q = -1, maxIterations = 100) => {
  assert(p >= 2);
  assert(q <= -1);

  let zn = z0;
  let term1 = complex(0);
  let term2 = complex(0);

  let iterations = 0;

  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
    term1 = powN(zn, p, term1);
    term2 = powN(zn, q, term2);
    if (term2.re === Infinity || term2.im === Infinity) {
      return maxIterations;
    }

    term2 = mul(term2, lambda, term2);

    zn = add(term1, c, zn);
    zn = sub(zn, term2, zn);

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  // the number of iterations represent the "speed" at which the magnitude of the zₙ
  // sequence exceeds the bailout radius
  return iterations / maxIterations;
};

const LOGLOG2 = Math.log(Math.log(2));
export const continuousRationalMap = (z0, c, lambda, p = 2, q = -1, maxIterations = 100) => {
  assert(p >= 2);
  assert(q <= -1);

  let zn = z0;
  let term1 = complex(0);
  let term2 = complex(0);

  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
    term1 = powN(zn, p, term1);
    term2 = powN(zn, q, term2);
    if (term2.re === Infinity || term2.im === Infinity) {
      return maxIterations;
    }

    term2 = mul(term2, lambda, term2);

    zn = add(term1, c, zn);
    zn = sub(zn, term2, zn);

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  if (iterations === maxIterations) {
    return 1;
  }

  // the number of iterations is normalized to produce a continuous value
  // that will avoid the "banding" effect that appears when the coloring is based only on the iterations count
  const quantity = (LOGLOG2 - Math.log(Math.log(modulus(zn)))) / Math.log(p);
  return (iterations + quantity) / maxIterations;
};

export const orbitTrapRationalMap = (z0, c, lambda, trap, p = 2, q = -1, maxIterations = 100) => {
  assert(p >= 2);
  assert(q <= -1);

  let zn = z0;
  let term1 = complex(0);
  let term2 = complex(0);

  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
    term1 = powN(zn, p, term1);
    term2 = powN(zn, q, term2);
    if (term2.re === Infinity || term2.im === Infinity) {
      return trap.untrappedValue;
    }

    term2 = mul(term2, lambda, term2);

    zn = add(term1, c, zn);
    zn = sub(zn, term2, zn);

    // if the point is trapped, we return the interpolated value from the trap
    if (trap.isTrapped(zn)) {
      return trap.interpolateTrap(zn);
    }

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  return trap.untrappedValue;
};

export const RATIONALMAP_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};
