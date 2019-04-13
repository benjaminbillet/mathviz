import { powN, add, complex, mul, modulus } from '../utils/complex';

export const phoenix = (z0, c, p, d = 2, maxIterations = 100) => {
  let zold = complex(0, 0);
  let zn = z0;

  // we analyze the behavior of zₙ only for a maximum number of iterations
  let iterations = 0;

  // we will compare the squared magnitude to the squared bailout radius
  // (it will avoid a costly square root)
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
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


const LOGLOG2 = Math.log(Math.log(2));
export const continuousPhoenix = (z0, c, p, d = 2, maxIterations = 100) => {
  let zold = complex(0, 0);
  let zn = z0;
  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
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
  const quantity = (LOGLOG2 - Math.log(Math.log(modulus(zn)))) / Math.log(d);
  return (iterations + quantity) / maxIterations;
};

export const orbitTrapPhoenix = (z0, c, p, trap, d = 2, maxIterations = 100) => {
  let zold = complex(0, 0);
  let zn = z0;
  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= 4 && iterations < maxIterations) {
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

export const PHOENIX_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};
