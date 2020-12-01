import { ComplexNumber } from '../utils/complex';
import { ComplexToColorFunction, OrbitTrap } from '../utils/types';

export const makePhoenix = (c: ComplexNumber, p: ComplexNumber, d = 2, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zold = new ComplexNumber(0, 0);
    let zn = z0;

    // we analyze the behavior of zₙ only for a maximum number of iterations
    let iterations = 0;

    // we will compare the squared magnitude to the squared bailout radius
    // (it will avoid a costly square root)
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      const re = zn.re;
      const im = zn.im;

      //  zₙ₊₁ = zₙ² + c + p·zₙ₋₁
      zn = zn.powN(d, zn).add(c, zn);

      zold = zold.mul(p, zold);
      zn = zn.add(zold, zn);

      squaredMagnitude = zn.squaredModulus();

      zold.set(re, im);
      iterations++;
    }

    // the number of iterations represent the "speed" at which the magnitude of the zₙ
    // sequence exceeds the bailout radius
    return iterations / maxIterations;
  };
};

export const makeContinuousPhoenix = (c: ComplexNumber, p: ComplexNumber, d = 2, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zold = new ComplexNumber(0, 0);
    let zn = z0;
    let iterations = 0;
    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      const re = zn.re;
      const im = zn.im;

      zn = zn.powN(d, zn).add(c, zn);

      zold = zold.mul(p, zold);
      zn = zn.add(zold, zn);

      squaredMagnitude = zn.squaredModulus();

      zold.set(re, im);
      iterations++;
    }

    if (iterations === maxIterations) {
      return 1;
    }

    // the number of iterations is normalized to produce a continuous value
    // that will avoid the "banding" effect that appears when the coloring is based only on the iterations count
    const quantity = 1 + invLogD * Math.log(logBailout / Math.log(zn.modulus()));
    return (iterations + quantity) / maxIterations;
  };
};

export const makeOrbitTrapPhoenix = (c: ComplexNumber, p: ComplexNumber, trap: OrbitTrap, d = 2, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zold = new ComplexNumber(0, 0);
    let zn = z0;
    let iterations = 0;
    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      const re = zn.re;
      const im = zn.im;

      zn = zn.powN(d, zn).add(c, zn);

      zold = zold.mul(p, zold);
      zn = zn.add(zold, zn);

      // if the point is trapped, we return the interpolated value from the trap
      if (trap.isTrapped(zn)) {
        return trap.interpolateTrap(zn);
      }

      squaredMagnitude = zn.squaredModulus();

      zold.set(re, im);
      iterations++;
    }

    return trap.untrappedValue;
  };
};


const stripeAverage = (z: ComplexNumber, stripeDensity: number) => 0.5 * Math.sin(stripeDensity * Math.atan2(z.im, z.re)) + 0.5;

export const makeStripeAveragePhoenixLinear = (c: ComplexNumber, p: ComplexNumber, d = 2, bailout = 100, maxIterations = 100, stripeDensity = 10): ComplexToColorFunction => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zold = new ComplexNumber(0, 0);
    let zn = z0;

    let iterations = 0;
    let sum = 0;
    let lastAdded = 0;

    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      const re = zn.re;
      const im = zn.im;

      zn = zn.powN(d, zn).add(c, zn);

      zold = zold.mul(p, zold);
      zn = zn.add(zold, zn);

      squaredMagnitude = zn.squaredModulus();

      iterations++;
      lastAdded = stripeAverage(zn, stripeDensity);
      sum += lastAdded;

      zold.set(re, im);
    }

    if (iterations <= 1) {
      return 0;
    } else if (iterations === maxIterations) {
      return 1;
    }

    const avg1 = sum / iterations;
    const avg2 = (sum - lastAdded) / (iterations - 1);

    // linear interpolation between all iterations average and all-1 iterations average
    const quantity = 1 + invLogD * Math.log(logBailout / Math.log(zn.modulus()));
    return quantity * avg1 + (1 - quantity) * avg2;
  };
};

export const PHOENIX_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};
