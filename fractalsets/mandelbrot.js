// a complex number u=x+yi (x ∈ [-2, 1], y ∈ [-1, 1]) is in the mandelbrot set if:
// - the sequence zₙ₊₁ = zₙ² + u (z₀ = 0) converges to a complex number with a magnitude (= vector length) ≤ 2
// with z₀ = 0

// the mandelbrot set definition is similar to the julia set definition, except that we vary the first-order term instead of z₀.

// Note: in the  zₙ₊₁ = zₙ² + u sequence, zₙ² can be replaced by zₙᵈ (d > 2) to create multibrot sets.

import { complex, powN, add, modulus } from '../utils/complex';


export const mandelbrot = (u, d = 2, maxIterations = 100) => {
  let zn = complex(0, 0);

  // we analyze the behavior of zₙ only for a maximum number of iterations
  let iterations = 0;

  // we will compare the squared magnitude to the squared bailout radius
  // (it will avoid a costly square root)
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
    zn = powN(zn, d, zn);
    zn = add(zn, u, zn);

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  // the number of iterations represent the "speed" at which the magnitude of the zₙ
  // sequence exceeds the bailout radius
  return iterations / maxIterations;
};

const LOGLOG2 = Math.log(Math.log(2));
export const continuousMandelbrot = (u, d = 2, maxIterations = 100) => {
  let zn = complex(0, 0);
  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
    zn = powN(zn, d, zn);
    zn = add(zn, u, zn);

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  if (iterations === maxIterations) {
    return 1;
  }

  // the number of iterations is normalized to produce a continuous value
  // that will avoid the "banding" effect that appears when the coloring is based only on the iterations count
  const quantity = (LOGLOG2 - Math.log(Math.log(modulus(zn)))) / Math.log(d);
  return (iterations + quantity) / maxIterations;
};

export const orbitTrapMandelbrot = (u, trap, d = 2, maxIterations = 100) => {
  let zn = complex(0, 0);
  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
    zn = powN(zn, d, zn);
    zn = add(zn, u, zn);

    // if the point is trapped, we return the interpolated value from the trap
    if (trap.isTrapped(zn)) {
      return trap.interpolateTrap(zn);
    }

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  return trap.untrappedValue;
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

