import assert from 'assert';

import { modulus, powN, add, sub, complex, mul } from '../utils/complex';

// http://usefuljs.net/fractals/docs/rational_maps.html

export const makeRationalMap = (c, lambda, p = 2, q = -1, bailout = 2, maxIterations = 100) => {
  const squaredBailout = bailout * bailout;

  return (z0) => {
    assert(p >= 2);
    assert(q <= -1);

    let zn = z0;
    let term1 = complex(0);
    let term2 = complex(0);

    let iterations = 0;

    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      term1 = powN(zn, p, term1);
      term2 = powN(zn, q, term2);
      if (term2.re === Infinity || term2.im === Infinity) {
        return 1;
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
};

export const makeContinuousRationalMap = (c, lambda, p = 2, q = -1, bailout = 2, maxIterations = 100) => {
  const invLogP = 1 / Math.log(p);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    assert(p >= 2);
    assert(q <= -1);

    let zn = z0;
    let term1 = complex(0);
    let term2 = complex(0);

    let iterations = 0;
    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      term1 = powN(zn, p, term1);
      term2 = powN(zn, q, term2);
      if (term2.re === Infinity || term2.im === Infinity) {
        return 1;
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
    const quantity = 1 + invLogP * Math.log(logBailout / Math.log(modulus(zn)));
    return (iterations + quantity) / maxIterations;
  };
};

export const makeOrbitTrapRationalMap = (c, lambda, trap, p = 2, q = -1, bailout = 2, maxIterations = 100) => {
  const squaredBailout = bailout * bailout;

  return (z0) => {
    assert(p >= 2);
    assert(q <= -1);

    let zn = z0;
    let term1 = complex(0);
    let term2 = complex(0);

    let iterations = 0;
    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
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
};


const stripeAverage = (z, stripeDensity) => 0.5 * Math.sin(stripeDensity * Math.atan2(z.im, z.re)) + 0.5;

export const makeStripeAverageRationalMapLinear = (c, lambda, p = 2, q = -1, bailout = 100, maxIterations = 100, stripeDensity = 10) => {
  const invLogP = 1 / Math.log(p);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    assert(p >= 2);
    assert(q <= -1);

    let zn = z0;
    let term1 = complex(0);
    let term2 = complex(0);

    let iterations = 0;
    let sum = 0;
    let lastAdded = 0;

    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      term1 = powN(zn, p, term1);
      term2 = powN(zn, q, term2);
      if (term2.re === Infinity || term2.im === Infinity) {
        return 1;
      }

      term2 = mul(term2, lambda, term2);

      zn = add(term1, c, zn);
      zn = sub(zn, term2, zn);

      squaredMagnitude = zn.re*zn.re + zn.im*zn.im;

      iterations++;
      lastAdded = stripeAverage(zn, stripeDensity);
      sum += lastAdded;
    }

    if (iterations <= 1) {
      return 0;
    } else if (iterations === maxIterations) {
      return 1;
    }

    const avg1 = sum / iterations;
    const avg2 = (sum - lastAdded) / (iterations - 1);

    // linear interpolation between all iterations average and all-1 iterations average
    const quantity = 1 + invLogP * Math.log(logBailout / Math.log(modulus(zn)));
    return quantity * avg1 + (1 - quantity) * avg2;
  };
};

export const RATIONALMAP_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};
