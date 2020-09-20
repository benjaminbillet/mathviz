import { complex, ComplexNumber } from '../utils/complex';

// http://paulbourke.net/fractals/thorn

export const makeSecantSea = (c: ComplexNumber, bailout = 100, maxIterations = 100) => {
  const squaredBailout = bailout * bailout;
  return (z0: ComplexNumber) => {
    let zn = z0;

    // we analyze the behavior of zₙ only for a maximum number of iterations
    let iterations = 0;

    // we will compare the squared magnitude to the squared bailout radius
    // (it will avoid a costly square root)
    let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
    while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
      zn = complex(zn.re / Math.cos(zn.im) + c.re, zn.im / Math.sin(zn.re) + c.im);

      squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
      iterations++;
    }

    // the number of iterations represent the "speed" at which the magnitude of the zₙ
    // sequence exceeds the bailout radius
    return iterations / maxIterations;
  };
};

export const SECANT_SEA_DOMAIN = {
  xmin: -Math.PI,
  xmax: Math.PI,
  ymin: -Math.PI,
  ymax: Math.PI,
};
