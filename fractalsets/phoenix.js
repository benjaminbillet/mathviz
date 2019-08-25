import { powN, add, complex, mul, modulus } from '../utils/complex';

export const makePhoenix = (c, p, d = 2, bailout = 2, maxIterations = 100) => {
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zold = complex(0, 0);
    let zn = z0;

    // we analyze the behavior of zₙ only for a maximum number of iterations
    let iterations = 0;

    // we will compare the squared magnitude to the squared bailout radius
    // (it will avoid a costly square root)
    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      const re = zn.re;
      const im = zn.im;

      //  zₙ₊₁ = zₙ² + c + p·zₙ₋₁
      zn = powN(zn, d, zn);
      zn = add(zn, c, zn);

      zold = mul(zold, p, zold);
      zn = add(zn, zold, zn);

      squaredMagnitude = zn.re*zn.re + zn.im*zn.im;

      zold = complex(re, im, zold);
      iterations++;
    }

    // the number of iterations represent the "speed" at which the magnitude of the zₙ
    // sequence exceeds the bailout radius
    return iterations / maxIterations;
  };
};

export const makeContinuousPhoenix = (c, p, d = 2, bailout = 2, maxIterations = 100) => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zold = complex(0, 0);
    let zn = z0;
    let iterations = 0;
    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      const re = zn.re;
      const im = zn.im;

      zn = powN(zn, d, zn);
      zn = add(zn, c, zn);

      zold = mul(zold, p, zold);
      zn = add(zn, zold, zn);

      squaredMagnitude = zn.re*zn.re + zn.im*zn.im;

      zold = complex(re, im, zold);
      iterations++;
    }

    if (iterations === maxIterations) {
      return 1;
    }

    // the number of iterations is normalized to produce a continuous value
    // that will avoid the "banding" effect that appears when the coloring is based only on the iterations count
    const quantity = 1 + invLogD * Math.log(logBailout / Math.log(modulus(zn)));
    return (iterations + quantity) / maxIterations;
  };
};

export const makeOrbitTrapPhoenix = (c, p, trap, d = 2, bailout = 2, maxIterations = 100) => {
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zold = complex(0, 0);
    let zn = z0;
    let iterations = 0;
    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      const re = zn.re;
      const im = zn.im;

      zn = powN(zn, d, zn);
      zn = add(zn, c, zn);

      zold = mul(zold, p, zold);
      zn = add(zn, zold, zn);

      // if the point is trapped, we return the interpolated value from the trap
      if (trap.isTrapped(zn)) {
        return trap.interpolateTrap(zn);
      }

      squaredMagnitude = zn.re*zn.re + zn.im*zn.im;

      zold = complex(re, im, zold);
      iterations++;
    }

    return trap.untrappedValue;
  };
};


const stripeAverage = (z, stripeDensity) => 0.5 * Math.sin(stripeDensity * Math.atan2(z.im, z.re)) + 0.5;

export const makeStripeAveragePhoenixLinear = (c, p, d = 2, bailout = 100, maxIterations = 100, stripeDensity = 10) => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zold = complex(0, 0);
    let zn = z0;

    let iterations = 0;
    let sum = 0;
    let lastAdded = 0;

    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      const re = zn.re;
      const im = zn.im;

      zn = powN(zn, d, zn);
      zn = add(zn, c, zn);

      zold = mul(zold, p, zold);
      zn = add(zn, zold, zn);

      squaredMagnitude = zn.re*zn.re + zn.im*zn.im;

      iterations++;
      lastAdded = stripeAverage(zn, stripeDensity);
      sum += lastAdded;

      zold = complex(re, im, zold);
    }

    if (iterations <= 1) {
      return 0;
    } else if (iterations === maxIterations) {
      return 1;
    }

    const avg1 = sum / iterations;
    const avg2 = (sum - lastAdded) / (iterations - 1);

    // linear interpolation between all iterations average and all-1 iterations average
    const quantity = 1 + invLogD * Math.log(logBailout / Math.log(modulus(zn)));
    return quantity * avg1 + (1 - quantity) * avg2;
  };
};

export const PHOENIX_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};
