import { sin, ComplexNumber } from '../utils/complex';

export const makeTrigJulia = (c: ComplexNumber, trigFunc = sin, bailout = 50, maxIterations = 100) => {
  return (z0: ComplexNumber) => {
    let zn = z0;
    let iterations = 0;

    while (Math.abs(zn.im) <= bailout && iterations < maxIterations) {
      zn = trigFunc(zn, zn).mul(c, zn);
      iterations++;
    }

    return iterations / maxIterations;
  };
};


const stripeAverage = (z: ComplexNumber, stripeDensity: number) => 0.5 * Math.sin(stripeDensity * Math.atan2(z.im, z.re)) + 0.5;

export const makeStripeAverageTrigJuliaLinear = (c: ComplexNumber, trigFunc = sin, bailout = 50, maxIterations = 100, stripeDensity = 10) => {
  const invLogD = 1; // 1 / Math.log(2);
  const logBailout = Math.log(bailout);

  return (z0: ComplexNumber) => {
    let zn = z0;

    let iterations = 0;
    let sum = 0;
    let lastAdded = 0;

    while (Math.abs(zn.im) <= bailout && iterations < maxIterations) {
      zn = trigFunc(zn, zn).mul(c, zn);

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
    // note: this gives correct results, but discontinuities appear
    const quantity = 1 + invLogD * Math.log(logBailout / Math.log(zn.modulus()));
    return quantity * avg1 + (1 - quantity) * avg2;
  };
};

export const TRIGJULIA_DOMAIN = {
  xmin: -2 * Math.PI,
  xmax: 2 * Math.PI,
  ymin: -2 * Math.PI,
  ymax: 2 * Math.PI,
};
