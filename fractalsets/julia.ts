import { ComplexNumber } from '../utils/complex';
import { ComplexToColorFunction, OrbitTrap } from '../utils/types';

// a complex number u=x+yi (x, y ∈ [-2, 2]) is in the julia set if:
// - the sequence zₙ₊₁ = zₙ² + c converges to a complex number with a magnitude (= vector length) ≤ 2
//  with z₀ = u and with c = a+bi a fixed complex number (a, b ∈ [-2, 2])

// this video https://youtu.be/-V8HnG9XB2g shows, for c = -0.778 - 0.116i, how the complex space is folded when zₙ₊₁ = zₙ² + c is applied

// Note: in the zₙ₊₁ = zₙ² + c sequence, zₙ² can be replaced by zₙᵈ (d > 2) to create multijulia sets.

export const makeJulia = (c: ComplexNumber, d = 2, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zn = z0;

    // we analyze the behavior of zₙ only for a maximum number of iterations
    let iterations = 0;

    // we will compare the squared magnitude to the squared bailout radius
    // (it will avoid a costly square root)
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.powN(d, zn).add(c, zn);
      squaredMagnitude = zn.squaredModulus();
      iterations++;
    }

    // the number of iterations represent the "speed" at which the magnitude of the zₙ
    // sequence exceeds the bailout radius
    return iterations / maxIterations;
  };
};

export const makeContinousJulia = (c: ComplexNumber, d = 2, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zn = z0;
    let iterations = 0;
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.powN(d, zn).add(c, zn);
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

export const makeOrbitTrapJulia = (c: ComplexNumber, trap: OrbitTrap, d = 2, bailout = 2, maxIterations = 100): ComplexToColorFunction => {
  const squaredBailout = bailout * bailout;

  return (z0) => {
    let zn = z0;
    let iterations = 0;
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.powN(d, zn).add(c, zn);

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

export const makeStripeAverageJuliaLinear = (c: ComplexNumber, d = 2, bailout = 100, maxIterations = 100, stripeDensity = 10): ComplexToColorFunction => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (z0: ComplexNumber) => {
    let zn = z0;

    let iterations = 0;
    let sum = 0;
    let lastAdded = 0;

    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.powN(d, zn).add(c, zn);

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

export const JULIA_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};
