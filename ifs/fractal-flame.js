import { compose2dFunctions, clampInt } from '../utils/misc';
import { pickRandom, randomComplex } from '../utils/random';
import { makeIdentity } from '../transform';
import { mapDomainToPixel, normalizeBuffer } from '../utils/picture';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { makeColorMapFunction, buildColorMap, mixColorLinear } from '../utils/color';

export const generateTransformationSet = (nb, transformMakers, baseTransformMakers = null) => {
  return new Array(nb).fill(null).map(() => {
    const makeTransform = pickRandom(transformMakers);
    if (baseTransformMakers != null) {
      const baseTransforms = baseTransformMakers.map(f => f());
      return compose2dFunctions(...baseTransforms, makeTransform());
    }
    return makeTransform();
  });
};

export const makeBitmapColorSteal = (bitmap, bitmapWidth, bitmapHeight, domain = BI_UNIT_DOMAIN) => {
  const normalized = normalizeBuffer(new Float32Array(bitmap));
  return (x, y) => {
    let [ px, py ] = mapDomainToPixel(x, y, domain, bitmapWidth, bitmapHeight);
    px = clampInt(px, 0, bitmapWidth);
    py = clampInt(py, 0, bitmapHeight);

    const idx = (px + py * bitmapWidth) * 4;
    return normalized.slice(idx, idx + 3);
  };
};

export const makeDistanceColorSteal = (colors, maxDistance) => {
  let colorFunc = colors;
  if (Array.isArray(colors)) {
    colorFunc = makeColorMapFunction(buildColorMap(colors), 255);
  }
  return (re, im) => {
    const distance = Math.sqrt(re * re + im * im) / maxDistance;
    return colorFunc(distance);
  };
};

export const makeIterationColorSteal = (colors, maxIterations) => {
  let colorFunc = colors;
  if (Array.isArray(colors)) {
    colorFunc = makeColorMapFunction(buildColorMap(colors), 255);
  }
  return (re, im, p, n) => {
    return colorFunc(n / maxIterations);
  };
};

export const makeMixedColorSteal = (colors, maxDistance, maxIterations, w1 = 0.5, w2 = 0.5) => {
  let colorFunc = colors;
  if (Array.isArray(colors)) {
    colorFunc = makeColorMapFunction(buildColorMap(colors), 255);
  }
  return (re, im, p, n) => {
    const distance = Math.sqrt(re * re + im * im) / maxDistance;
    return colorFunc(w1 * distance + w2 * (n / maxIterations));
  };
};

export const plotFlame = (
  transforms,
  randomInt,
  colors,
  plotter,
  initialPointPicker = randomComplex,
  finalTransform = makeIdentity(),
  nbPoints = 1000,
  nbIterations = 10000,
  resetIfOverflow = false,
  colorMerge = mixColorLinear,
) => {
  for (let i = 0; i < nbPoints; i++) {
    let z = initialPointPicker(); // pick an initial point
    let pixelColor = [ 0, 0, 0 ];
    for (let j = 0; j < nbIterations; j++) {
      // at each iteration, we pick a function and an associated color from the ifs...
      const selected = randomInt();
      const transform = transforms[selected];
      const color = colors[selected];

      // at each iteration we apply one of the function...
      z = transform(z);

      // ... and a final transform that will not be part of the iteration...
      const fz = finalTransform(z);

      // each selected function contribute to the color of this iteration
      pixelColor = colorMerge(color, pixelColor);

      // we draw the pixel (the returned value is the pixel coordinate array)
      const mapped = plotter(fz, pixelColor);

      // pixels that are outside the image (i.e., the plotter returned null) are not plotted
      // and we escape by jumping to another point
      if (mapped == null && resetIfOverflow) {
        z = initialPointPicker();
      }
    }
  }
};

export const plotFlameWithColorStealing = (
  transforms,
  randomInt,
  colorFunc,
  plotter,
  preFinalColor = false,
  initialPointPicker = randomComplex,
  finalTransform = makeIdentity(),
  nbPoints = 1000,
  nbIterations = 10000,
  resetIfOverflow = false,
  colorMerge = mixColorLinear,
) => {
  for (let i = 0; i < nbPoints; i++) {
    let z = initialPointPicker(); // pick an initial point
    let pixelColor = [ 0, 0, 0 ];
    for (let j = 0; j < nbIterations; j++) {
      // at each iteration, we pick a function and an associated color from the ifs...
      const selected = randomInt();
      const transform = transforms[selected];

      // at each iteration we apply one of the function...
      z = transform(z);
      // ... and a final transform that will not be part of the iteration...
      const fz = finalTransform(z);

      // the color function takes a point and return the associated color
      let color = null;
      if (preFinalColor) {
        color = colorFunc(z.re, z.im, i, j);
      } else {
        color = colorFunc(fz.re, fz.im, i, j);
      }

      // each color contribute to the color of this iteration
      pixelColor = colorMerge(color, pixelColor);

      // we draw the pixel (the returned value is the pixel coordinate array)
      const mapped = plotter(fz, pixelColor);

      // pixels that are outside the image (i.e., the plotter returned null) are not plotted
      // and we escape by jumping to another point
      if (mapped == null && resetIfOverflow) {
        z = initialPointPicker();
      }
    }
  }
};

export const estimateFlameDomain = (transforms, randomInt, initialPointPicker = randomComplex, finalTransform = makeIdentity(), nbIterations = 10000) => {
  let xmin = Number.MAX_SAFE_INTEGER;
  let xmax = Number.MIN_SAFE_INTEGER;
  let ymin = Number.MAX_SAFE_INTEGER;
  let ymax = Number.MIN_SAFE_INTEGER;

  let z = initialPointPicker();
  for (let i = 0; i < nbIterations; i++) {
    const transform = transforms[randomInt()];

    z = transform(z);
    const fz = finalTransform(z);

    if (fz.re < xmin) {
      xmin = fz.re;
    } else if (fz.re > xmax) {
      xmax = fz.re;
    }
    if (fz.im < ymin) {
      ymin = fz.im;
    } else if (fz.im > ymax) {
      ymax = fz.im;
    }
  }
  return { xmin, xmax, ymin, ymax };
};
