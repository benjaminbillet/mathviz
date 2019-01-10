import { modulus } from '../utils/complex';

export const makeCustom = (z0, f, bailoutRadiusSquared = 4, maxIterations = 100) => {
  let zn = z0;

  // we analyze the behavior of zₙ only for a maximum number of iterations
  let iterations = 0;

  // we will compare the squared magnitude to the squared bailout radius
  // (it will avoid a costly square root)
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= bailoutRadiusSquared && iterations < maxIterations) {
    zn = f(zn);
    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  // the number of iterations represent the "speed" at which the magnitude of the zₙ
  // sequence exceeds the bailout radius
  return iterations / maxIterations;
};

export const makeContinuousCustom = (z0, f, d = 2, bailoutRadiusSquared = 4, maxIterations = 100) => {
  let zn = z0;
  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= bailoutRadiusSquared && iterations < maxIterations) {
    zn = f(zn);
    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  if (iterations === maxIterations) {
    return 1;
  }

  // the number of iterations is normalized to produce a continuous value
  // that will avoid the "banding" effect that appears when the coloring is based only on the iterations count
  const quantity = (Math.log(Math.log(Math.sqrt(bailoutRadiusSquared))) - Math.log(Math.log(modulus(zn)))) / Math.log(d);
  return (iterations + quantity) / maxIterations;
};

export const makeOrbitTrapCustom = (z0, f, trap, bailoutRadiusSquared = 4, maxIterations = 100) => {
  let zn = z0;
  let iterations = 0;
  let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
  while (squaredMagnitude <= bailoutRadiusSquared && iterations < maxIterations) {
    zn = f(zn);

    // if the point is trapped, we return the interpolated value from the trap
    if (trap.isTrapped(zn)) {
      return trap.interpolateTrap(zn);
    }

    squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    iterations++;
  }

  return trap.untrappedValue;
};
