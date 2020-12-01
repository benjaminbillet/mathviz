import { compose2dFunctions, clampInt } from '../utils/misc';
import { pickRandom, randomComplex } from '../utils/random';
import { makeIdentity } from '../transform';
import { mapDomainToPixel, normalizeBuffer } from '../utils/picture';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { makeColorMapFunction, buildColorMap, mixColorLinear } from '../utils/color';
import { Color, ColorMapFunction, ColorSteal, ComplexPlotter, IterableRealFunction, Transform2D, TransformMaker } from '../utils/types';
import { ComplexNumber } from '../utils/complex';

export const generateTransformationSet = (nb: number, transformMakers: TransformMaker[], baseTransformMakers?: TransformMaker[]) => {
  return new Array(nb).fill(null).map(() => {
    const makeTransform = pickRandom(transformMakers);
    if (baseTransformMakers != null) {
      const baseTransforms = baseTransformMakers.map(f => f());
      return compose2dFunctions(...baseTransforms, makeTransform());
    }
    return makeTransform();
  });
};

export const makeBitmapColorSteal = (bitmap: Float32Array, bitmapWidth: number, bitmapHeight: number, domain = BI_UNIT_DOMAIN): ColorSteal => {
  const normalized = normalizeBuffer(new Float32Array(bitmap), bitmapWidth, bitmapHeight);
  return (x: number, y: number) => {
    let [ px, py ] = mapDomainToPixel(x, y, domain, bitmapWidth, bitmapHeight);
    px = clampInt(px, 0, bitmapWidth);
    py = clampInt(py, 0, bitmapHeight);

    const idx = (px + py * bitmapWidth) * 4;
    return [ normalized[idx + 0], normalized[idx + 1], normalized[idx + 2], normalized[idx + 3] ];
  };
};

const getColorMapFunction = (colors: ColorMapFunction | Color[]): ColorMapFunction => {
  if (Array.isArray(colors)) {
    return makeColorMapFunction(buildColorMap(colors));
  }
  return colors;
}

export const makeDistanceColorSteal = (colors: ColorMapFunction | Color[], maxDistance: number): ColorSteal => {
  const colorFunc = getColorMapFunction(colors);
  return (x: number, y: number) => {
    const distance = Math.sqrt(x * x + y * y) / maxDistance;
    return colorFunc(distance);
  };
};

export const makeIterationColorSteal = (colors: ColorMapFunction | Color[], maxIterations: number): ColorSteal => {
  const colorFunc = getColorMapFunction(colors);
  return (re, im, p, n) => {
    return colorFunc(n / maxIterations);
  };
};

export const makeMixedColorSteal = (colors: ColorMapFunction | Color[], maxDistance: number, maxIterations: number, w1 = 0.5, w2 = 0.5): ColorSteal => {
  const colorFunc = getColorMapFunction(colors);
  return (re, im, p, n) => {
    const distance = Math.sqrt(re * re + im * im) / maxDistance;
    return colorFunc(w1 * distance + w2 * (n / maxIterations));
  };
};

export const plotFlame = (
  transforms: Transform2D[],
  randomInt: IterableRealFunction,
  colors: Color[],
  plotter: ComplexPlotter,
  initialPointPicker = randomComplex,
  finalTransform = makeIdentity(),
  nbPoints = 1000,
  nbIterations = 10000,
  resetIfOverflow = false,
  colorMerge = mixColorLinear,
) => {
  for (let i = 0; i < nbPoints; i++) {
    let z = initialPointPicker(); // pick an initial point
    let pixelColor: Color = [ 0, 0, 0, 1 ];
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
      const drawn = plotter(fz, pixelColor);

      // pixels that are outside the image (i.e., the plotter returned null) are not plotted
      // and we escape by jumping to another point
      if (drawn === false && resetIfOverflow) {
        z = initialPointPicker();
      }
    }
  }
};


export const iterateFlamePoint = (
  z: ComplexNumber,
  transforms: Transform2D[],
  randomInt: IterableRealFunction,
  colors: Color[],
  plotter: ComplexPlotter,
  finalTransform = makeIdentity(),
  nbIterations = 10000,
  colorMerge = mixColorLinear,
) => {
  let pixelColor: Color = [ 0, 0, 0, 1 ];
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
    plotter(fz, pixelColor);
  }
};

export const plotFlameWithColorStealing = (
  transforms: Transform2D[],
  randomInt: IterableRealFunction,
  colorFunc: ColorSteal,
  plotter: ComplexPlotter,
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
    let pixelColor: Color = [ 0, 0, 0, 1 ];
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

export const estimateFlameDomain = (transforms: Transform2D[], randomInt: IterableRealFunction, initialPointPicker = randomComplex, finalTransform = makeIdentity(), nbIterations = 10000) => {
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
