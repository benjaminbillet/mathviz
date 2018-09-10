// a complex number u=x+yi (x ∈ [-2, 2], y ∈ [-2, 2]) is in the mandelbar set if:
// - the sequence zₙ₊₁ = z̅ₙ² + u (z₀ = 0) converges to a complex number with a magnitude (= vector length) ≤ 2
// with z₀ = 0

// the mandelbar set definition is similar to the mandelbrot set definition, except that we iterate the conjugate of zₙ.

// Note: in the zₙ₊₁ = z̅ₙ² + c sequence, z̅ₙ² can be replaced by z̅ₙᵈ (d > 2) to create multibar sets.

import Complex from 'complex.js';

export const mandelbar = (u, d = 2, maxIterations = 100) => {
  let zn = new Complex(0, 0);

  // we analyze the behavior of zₙ only for a maximum number of iterations
  let iterations = 0;

  // we will compare the squared magnitude to the squared bailout radius
  // (it will avoid a costly square root)
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
    zn = zn.conjugate().pow(d).add(u);

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  // the number of iterations represent the "speed" at which the magnitude of the zₙ
  // sequence exceeds the bailout radius
  return iterations / maxIterations;
};

const LOGLOG2 = Math.log(Math.log(2));
export const continuousMandelbar = (u, d = 3, maxIterations = 100) => {
  let zn = new Complex(0, 0);
  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
    zn = zn.conjugate().pow(d).add(u);

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  if (iterations === maxIterations) {
    return 1;
  }

  // the number of iterations is normalized to produce a continuous value
  // that will avoid the "banding" effect that appears when the coloring is based only on the iterations count
  const quantity = (LOGLOG2 - Math.log(Math.log(zn.abs()))) / Math.log(d);
  return (iterations + quantity) / maxIterations;
};

export const orbitTrapMandelbar = (u, trap, d = 3, maxIterations = 100) => {
  let zn = new Complex(0, 0);
  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
    zn = zn.conjugate().pow(d).add(u);

    // if the point is trapped, we return the interpolated value from the trap
    if (trap.isTrapped(zn)) {
      return trap.interpolateTrap(zn);
    }

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  return trap.untrappedValue;
};

export const MANDELBAR_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};