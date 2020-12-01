import { euclidean2d } from '../utils/distance';
import { MANDELBROT_DOMAIN } from './mandelbrot';
import { buildConstrainedColorMap, makeColorMapFunction } from '../utils/color';
import { forEachPixel, mapPixelToDomain, mapDomainToPixel, reducePixels } from '../utils/picture';
import { complex, powN, add } from '../utils/complex';
import { ColorMapFunction, ComplexToBoolFunction, PixelPlotter, PlotDomain } from '../utils/types';


const DEFAULT_COLOR_FUNC = makeColorMapFunction(buildConstrainedColorMap(
  [ [ 0.35, 0, 0.35, 1 ], [ 1, 0.92, 1, 1 ], [ 1, 0.92, 1, 1 ] ],
  [ 0, 0.33, 1 ],
));

const DEFAULT_ANTI_COLOR_FUNC = makeColorMapFunction(buildConstrainedColorMap(
  [ [ 0.35, 0, 0.35, 1 ], [ 1, 0.92, 1, 1 ], [ 1, 0.92, 1, 1 ] ],
  [ 0, 0.1, 1 ],
));

const makeSymmetricPlotter = (buffer: Float32Array, width: number, height: number, domain: PlotDomain): PixelPlotter => {
  return (x, y) => {
    const [ fx, fy ] = mapDomainToPixel(x, y, domain, width, height);
    const idx = (fx + fy * width) * 4;
    buffer[idx + 3] += 1;

    if (y !== 0) {
      const fy2 = height - fy; // plot symmetry
      const idx2 = (fx + fy2 * width) * 4;
      buffer[idx2 + 3] += 1;
    }
  };
};

const postColorize = (buffer: Float32Array, width: number, height: number, colorfunc: ColorMapFunction) => {
  const max = reducePixels(buffer, width, height, (max, r, g, b, a) => Math.max(max, a), Number.MIN_SAFE_INTEGER);

  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    const color = colorfunc(a / max);
    buffer[idx + 0] = color[0];
    buffer[idx + 1] = color[1];
    buffer[idx + 2] = color[2];
    buffer[idx + 3] = 1;
  });

  return buffer;
};

export const plotBuddhabrot = (width: number, height: number, maxIterations = 1000, accuracyFactor = 4, domain = MANDELBROT_DOMAIN, colorfunc = DEFAULT_COLOR_FUNC) => {
  const bailout = 2;
  const d = 2;
  const squaredBailout = bailout * bailout;
  const iterationsRe = new Float32Array(maxIterations);
  const iterationsIm = new Float32Array(maxIterations);

  const buffer = new Float32Array(width * height * 4);
  const plotter = makeSymmetricPlotter(buffer, width, height, domain);

  const halfHeight = Math.ceil(height / 2);
  const maxI = width * accuracyFactor;
  const maxJ = halfHeight * accuracyFactor;

  for (let i = 0; i < maxI; i++) {
    for (let j = 0; j < maxJ; j++) {
      const [ x, y ] = mapPixelToDomain(i / accuracyFactor, j / accuracyFactor, width, height, domain);
      const u = complex(x, y);

      if (isInteresting(u)) {
        let zn = complex(0, 0);
        let iterations = 0;

        let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
        while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
          zn = powN(zn, d, zn);
          zn = add(zn, u, zn);
          iterationsRe[iterations] = zn.re;
          iterationsIm[iterations] = zn.im;
          squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
          iterations++;
        }

        if (iterations < maxIterations) {
          for (let k = 0; k < iterations; k++) {
            plotter(iterationsRe[k], iterationsIm[k]);
          }
        }
      }
    }
  }

  return postColorize(buffer, width, height, colorfunc);
};

export const plotAntiBuddhabrot = (width: number, height: number, maxIterations = 1000, accuracyFactor = 4, domain = MANDELBROT_DOMAIN, colorfunc = DEFAULT_ANTI_COLOR_FUNC) => {
  const bailout = 2;
  const d = 2;
  const squaredBailout = bailout * bailout;
  const iterationsRe = new Float32Array(maxIterations);
  const iterationsIm = new Float32Array(maxIterations);

  const buffer = new Float32Array(width * height * 4);
  const plotter = makeSymmetricPlotter(buffer, width, height, domain);

  const halfHeight = Math.ceil(height / 2);
  const maxI = width * accuracyFactor;
  const maxJ = halfHeight * accuracyFactor;

  for (let i = 0; i < maxI; i++) {
    for (let j = 0; j < maxJ; j++) {
      const [ x, y ] = mapPixelToDomain(i / accuracyFactor, j / accuracyFactor, width, height, domain);
      const u = complex(x, y);

      if (isInteresting(u)) {
        let zn = complex(0, 0);
        let iterations = 0;

        let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
        while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
          zn = powN(zn, d, zn);
          zn = add(zn, u, zn);
          iterationsRe[iterations] = zn.re;
          iterationsIm[iterations] = zn.im;
          squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
          iterations++;
        }

        if (iterations === maxIterations) {
          for (let k = 0; k < iterations; k++) {
            plotter(iterationsRe[k], iterationsIm[k]);
          }
        }
      }
    }
  }

  return postColorize(buffer, width, height, colorfunc);
};

// detects the points that are in the (biggest) peripheral bulbs of the mandelbrot set
const isInPeripheralBulb: ComplexToBoolFunction = (z) => {
  if (euclidean2d(-1.30925, 0, z.re, z.im) < 0.05875) { // circumference centered at (-1.30925, 0 i) and radius 0.05875
    return true;
  } else if (euclidean2d(-1, 0, z.re, z.im) < 0.25) { // circumference centered at (-1, 0 i) and radius 0.25
    return true;
  } else if (euclidean2d(-0.125, -0.74401, z.re, z.im) < 0.094) { // circumference centered at (-0.125, -0.74401 i) and radius 0.094
    return true;
  } else if (euclidean2d(-0.125, -0.74401, z.re, z.im) < 0.094) { // circumference centered at (-0.125, 0.74401 i) and radius 0.094
    return true;
  }
  return false;
};

// detects the points that are in the main cardioid-shaped body of the mandelbrot set
const isInCardioid: ComplexToBoolFunction = (z) => {
  const reMinusFourth = z.re - 0.25;
  const imSquared = z.im * z.im;
  const q = reMinusFourth * reMinusFourth + imSquared;
  return (q * (q + reMinusFourth)) < (0.25 * imSquared);
};

export const isInteresting: ComplexToBoolFunction = (z) => {
  return !isInPeripheralBulb(z) && !isInCardioid(z);
};
