import { ComplexNumber } from '../utils/complex';
import { ComplexToColorFunction, OrbitTrap } from '../utils/types';

// http://usefuljs.net/fractals/docs/rational_maps.html

const checkArgs = (p: number, q: number) => {
  if (p < 2) {
    throw new Error('p < 2');
  }
  if (q > -1) {
    throw new Error('q > -1');
  }

}

export const makeRationalMap = (c: ComplexNumber, lambda: ComplexNumber, p = 2, q = -1, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  checkArgs(p, q);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zn = z0;
    let term1 = new ComplexNumber(0, 0);
    let term2 = new ComplexNumber(0, 0);

    let iterations = 0;

    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      term1 = zn.powN(p, term1);
      term2 = zn.powN(q, term2);
      if (term2.re === Infinity || term2.im === Infinity) {
        return 1;
      }

      zn = term1.add(c, zn).sub(term2.mul(lambda, term2), zn);

      squaredMagnitude = zn.squaredModulus();
      iterations++;
    }

    // the number of iterations represent the "speed" at which the magnitude of the zₙ
    // sequence exceeds the bailout radius
    return iterations / maxIterations;
  };
};

export const makeContinuousRationalMap = (c: ComplexNumber, lambda: ComplexNumber, p = 2, q = -1, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  checkArgs(p, q);

  const invLogP = 1 / Math.log(p);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zn = z0;
    let term1 = new ComplexNumber(0, 0);
    let term2 = new ComplexNumber(0, 0);

    let iterations = 0;
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      term1 = zn.powN(p, term1);
      term2 = zn.powN(q, term2);
      if (term2.re === Infinity || term2.im === Infinity) {
        return 1;
      }

      zn = term1.add(c, zn).sub(term2.mul(lambda, term2), zn);
      squaredMagnitude = zn.squaredModulus();
      iterations++;
    }

    if (iterations === maxIterations) {
      return 1;
    }

    // the number of iterations is normalized to produce a continuous value
    // that will avoid the "banding" effect that appears when the coloring is based only on the iterations count
    const quantity = 1 + invLogP * Math.log(logBailout / Math.log(zn.modulus()));
    return (iterations + quantity) / maxIterations;
  };
};

export const makeOrbitTrapRationalMap = (c: ComplexNumber, lambda: ComplexNumber, trap: OrbitTrap, p = 2, q = -1, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  checkArgs(p, q);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zn = z0;
    let term1 = new ComplexNumber(0, 0);
    let term2 = new ComplexNumber(0, 0);

    let iterations = 0;
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      term1 = zn.powN(p, term1);
      term2 = zn.powN(q, term2);
      if (term2.re === Infinity || term2.im === Infinity) {
        return trap.untrappedValue;
      }

      zn = term1.add(c, zn).sub(term2.mul(lambda, term2), zn);

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

export const makeStripeAverageRationalMapLinear = (c: ComplexNumber, lambda: ComplexNumber, p = 2, q = -1, bailout = 100, maxIterations = 100, stripeDensity = 10): ComplexToColorFunction => {
  checkArgs(p, q);

  const invLogP = 1 / Math.log(p);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zn = z0;
    let term1 = new ComplexNumber(0, 0);
    let term2 = new ComplexNumber(0, 0);

    let iterations = 0;
    let sum = 0;
    let lastAdded = 0;

    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      term1 = zn.powN(p, term1);
      term2 = zn.powN(q, term2);
      if (term2.re === Infinity || term2.im === Infinity) {
        return 1;
      }

      zn = term1.add(c, zn).sub(term2.mul(lambda, term2), zn);
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
    const quantity = 1 + invLogP * Math.log(logBailout / Math.log(zn.modulus()));
    return quantity * avg1 + (1 - quantity) * avg2;
  };
};

export const RATIONALMAP_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};
