// a complex number u=x+yi (x ∈ [-2, 1], y ∈ [-1, 1]) is in the mandelbrot set if:
// - the sequence zₙ₊₁ = zₙ² + u (z₀ = 0) converges to a complex number with a magnitude (= vector length) ≤ 2
// with z₀ = 0

// the mandelbrot set definition is similar to the julia set definition, except that we vary the first-order term instead of z₀.

// Note: in the  zₙ₊₁ = zₙ² + u sequence, zₙ² can be replaced by zₙᵈ (d > 2) to create multibrot sets.

import { ComplexNumber } from '../utils/complex';
import { ComplexToColorFunction, OrbitTrap, RealToRealFunction } from '../utils/types';

export const makeMandelbrot = (d = 2, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  const squaredBailout = bailout * bailout;

  return (u) => {
    let zn = new ComplexNumber(0, 0);

    // we analyze the behavior of zₙ only for a maximum number of iterations
    let iterations = 0;

    // we will compare the squared magnitude to the squared bailout radius
    // (it will avoid a costly square root)
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.powN(d, zn).add(u, zn);
      squaredMagnitude = zn.squaredModulus();
      iterations++;
    }

    // the number of iterations represent the "speed" at which the magnitude of the zₙ
    // sequence exceeds the bailout radius
    return iterations / maxIterations;
  };
};

export const makeContinousMandelbrot = (d = 2, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (u) => {
    let zn = new ComplexNumber(0, 0);
    let iterations = 0;
    let squaredMagnitude = zn.squaredModulus();

    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.powN(d, zn).add(u, zn);
      squaredMagnitude = zn.squaredModulus();
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

export const makeOrbitTrapMandelbrot = (trap: OrbitTrap, d = 2, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  const squaredBailout = bailout * bailout;

  return (u) => {
    let zn = new ComplexNumber(0, 0);
    let iterations = 0;
    let squaredMagnitude = zn.squaredModulus();

    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.powN(d, zn).add(u, zn);

      // if the point is trapped, we return the interpolated value from the trap
      if (trap.isTrapped(zn)) {
        return trap.interpolateTrap(zn);
      }

      squaredMagnitude = zn.squaredModulus();
      iterations++;
    }

    return trap.untrappedValue;
  };
};


const stripeAverage = (z: ComplexNumber, stripeDensity: number) => 0.5 * Math.sin(stripeDensity * Math.atan2(z.im, z.re)) + 0.5;

export const makeStripeAverageMandelbrotLinear = (d = 2, bailout = 100, maxIterations = 100, stripeDensity = 10): ComplexToColorFunction => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (u) => {
    let zn = new ComplexNumber(0, 0);

    let iterations = 0;
    let sum = 0;
    let lastAdded = 0;

    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.powN(d, zn).add(u, zn);
      squaredMagnitude = zn.squaredModulus();

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
    const quantity = 1 + invLogD * Math.log(logBailout / Math.log(zn.modulus()));
    return quantity * avg1 + (1 - quantity) * avg2;
  };
};


const h0: RealToRealFunction = x => 0.5 * (-x * x + x * x * x);
const h1: RealToRealFunction = x => 0.5 * (x + 4 * x * x - 3 * x * x * x);
const h2: RealToRealFunction = x => 0.5 * (2 - 5 * x * x + 3 * x * x * x);
const h3: RealToRealFunction = x => 0.5 * (-x + 2 * x * x - x * x * x);

export const makeStripeAverageMandelbrotCatmullrom = (d = 2, bailout = 100, maxIterations = 100, stripeDensity = 10): ComplexToColorFunction => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (u) => {
    let zn = new ComplexNumber(0, 0);

    let iterations = 0;
    let sum = 0;
    let lastAdded1 = 0; // TODO a bit ugly, an array and a loop would be nicer
    let lastAdded2 = 0;
    let lastAdded3 = 0;

    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.powN(d, zn).add(u, zn);
      squaredMagnitude = zn.squaredModulus();

      iterations++;

      lastAdded3 = lastAdded2;
      lastAdded2 = lastAdded1;
      lastAdded1 = stripeAverage(zn, stripeDensity);
      sum += lastAdded1;
    }

    if (iterations === 0) {
      return 0;
    } else if (iterations === maxIterations) {
      return 1;
    }

    const avg1 = sum / iterations;
    const avg2 = (sum - lastAdded1) / (iterations - 1);
    const avg3 = (sum - lastAdded1 - lastAdded2) / (iterations - 2);
    const avg4 = (sum - lastAdded1 - lastAdded2 - lastAdded3) / (iterations - 3);

    // catmull rom interpolation between all, all-1, all-2 and all-3 iterations average
    const quantity = 1 + invLogD * Math.log(logBailout / Math.log(zn.modulus()));
    return h0(quantity) * avg1 + h1(quantity) * avg2 + h2(quantity) * avg3 + h3(quantity) * avg4;
  };
};

export const MANDELBROT_DOMAIN = {
  xmin: -2,
  xmax: 1,
  ymin: -1,
  ymax: 1,
};

export const MULTIBROT_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};

