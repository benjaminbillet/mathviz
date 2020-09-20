// a complex number u=x+yi (x ∈ [-2, 2], y ∈ [-2, 2]) is in the mandelbar set if:
// - the sequence zₙ₊₁ = z̅ₙ² + u (z₀ = 0) converges to a complex number with a magnitude (= vector length) ≤ 2
// with z₀ = 0

// the mandelbar set definition is similar to the mandelbrot set definition, except that we iterate the conjugate of zₙ.

// Note: in the zₙ₊₁ = z̅ₙ² + c sequence, z̅ₙ² can be replaced by z̅ₙᵈ (d > 2) to create multibar sets.

import { ComplexNumber } from '../utils/complex';
import { OrbitTrap } from '../utils/types';

export const makeMandelbar = (d = 3, bailout = 2, maxIterations = 100) => {
  const squaredBailout = bailout * bailout;

  return (u: ComplexNumber) => {
    let zn = new ComplexNumber(0, 0);

    // we analyze the behavior of zₙ only for a maximum number of iterations
    let iterations = 0;

    // we will compare the squared magnitude to the squared bailout radius
    // (it will avoid a costly square root)
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.conjugate(zn).powN(d, zn).add(u, zn);
      squaredMagnitude = zn.squaredModulus();
      iterations++;
    }

    // the number of iterations represent the "speed" at which the magnitude of the zₙ
    // sequence exceeds the bailout radius
    return iterations / maxIterations;
  };
};

export const makeContinousMandelbar = (d = 3, bailout = 2, maxIterations = 100) => {
  const invLogD = 1 / Math.log(d);
  const logBailout = Math.log(bailout);
  const squaredBailout = bailout * bailout;

  return (u: ComplexNumber) => {
    let zn = new ComplexNumber(0, 0);
    let iterations = 0;
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.conjugate(zn).powN(d, zn).add(u, zn);
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

export const makeOrbitTrapMandelbar = (trap: OrbitTrap, d = 3, bailout = 2, maxIterations = 100) => {
  const squaredBailout = bailout * bailout;

  return (u: ComplexNumber) => {
    let zn = new ComplexNumber(0, 0);
    let iterations = 0;
    let squaredMagnitude = zn.squaredModulus();
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = zn.conjugate(zn).powN(d, zn).add(u, zn);

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

export const MANDELBAR_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};
