import { compose2dFunctions, clampInt } from '../utils/misc';
import { pickRandom, randomComplex } from '../utils/random';
import { makeIdentity } from '../transform';
import { mapDomainToPixel } from '../utils/picture';
import { BI_UNIT_DOMAIN } from '../utils/domain';

export const generateTransformationSet = (nb, transformMakers, baseTransformMakers = [ makeSimpleLinear ]) => {
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
  const normalized = new Float64Array(bitmapWidth * bitmapHeight * 4);
  bitmap.forEach((x, i) => normalized[i] = x / 255);
  return (x, y) => {
    let [ px, py ] = mapDomainToPixel(x, y, domain, bitmapWidth, bitmapHeight);
    px = clampInt(px, 0, bitmapWidth);
    py = clampInt(py, 0, bitmapHeight);

    const idx = (px + py * bitmapWidth) * 4;
    return normalized.slice(idx, idx + 3);
  };
};

export const plotFlame = (output, width, height, transforms, randomInt, colors, initialPointPicker = randomComplex, finalTransform = makeIdentity(), nbPoints = 1000, nbIterations = 10000, domain = BI_UNIT_DOMAIN) => {
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

      // ... then the transformed value is mapped to the pixel domain
      const [ fx, fy ] = mapDomainToPixel(fz.re, fz.im, domain, width, height);

      // pixels outside the image are discarded and we jump to another point
      if (fx < 0 || fy < 0 || fx >= width || fy >= height) {
        z = initialPointPicker();
        continue;
      }

      // each selected function contribute to the color of this iteration
      pixelColor = [
        (color[0] + pixelColor[0]) * 0.5,
        (color[1] + pixelColor[1]) * 0.5,
        (color[2] + pixelColor[2]) * 0.5,
      ];

      // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
      const idx = (fx + fy * width) * 4;

      // the iterated color is added to the current color; be careful, it means that you
      // will need some postprocessing in order to get the actual colors
      output[idx + 0] += pixelColor[0];
      output[idx + 1] += pixelColor[1];
      output[idx + 2] += pixelColor[2];
      // the alpha channel is hacked to store how many times the pixel was drawn
      output[idx + 3] += 1;
    }
  }
};

export const plotFlameWithColorStealing = (output, width, height, transforms, randomInt, colorFunc, preFinalColor = false, initialPointPicker = randomComplex, finalTransform = makeIdentity(), nbPoints = 1000, nbIterations = 10000, domain = BI_UNIT_DOMAIN) => { 
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

      // ... then the transformed value is mapped to the pixel domain
      const [ fx, fy ] = mapDomainToPixel(fz.re, fz.im, domain, width, height);

      // pixels that are outside the image are discarded
      // and we escape by jumping to another point
      if (fx < 0 || fy < 0 || fx >= width || fy >= height) {
        z = initialPointPicker();
        continue;
      }

      // the color function takes a point and return the associated color
      let color = null;
      if (preFinalColor) {
        color = colorFunc(z.re, z.im);
      } else {
        color = colorFunc(fz.re, fz.im);
      }

      // each color contribute to the color of this iteration
      pixelColor = [
        (color[0] + pixelColor[0]) * 0.5,
        (color[1] + pixelColor[1]) * 0.5,
        (color[2] + pixelColor[2]) * 0.5,
      ];

      // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
      const idx = (fx + fy * width) * 4;

      // the iterated color is added to the current color; be careful, it means that you
      // will need some postprocessing in order to get the actual colors
      output[idx + 0] += pixelColor[0];
      output[idx + 1] += pixelColor[1];
      output[idx + 2] += pixelColor[2];
      // the alpha channel is hacked to store how many times the pixel was drawn
      output[idx + 3] += 1;
    }
  }
};
