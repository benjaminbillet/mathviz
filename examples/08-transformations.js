import { complex, modulus } from '../utils/complex';

import { createImage, saveImage, mapPixelToDomain, mapDomainToPixel } from '../utils/picture';
import {
  makeFanFunction,
  makeNgonFunction,
  makeRingsFunction,
  makePowerFunction,
  makePopCornFunction,
  makeWaveFunction,
  makeSwirlFunction,
  makeBlobFunction,
  makePDJFunction,
  makePerspectiveFunction,
  makeCurlFunction,
  makeLinearFunction,
  makeMobiusFunction,
  makeSinusoidalFunction,
  makeSphericalFunction,
  makeMagnifyFunction,
  makeHorseshoeFunction,
  makePolarFunction,
  makeHandkerchiefFunction,
  makeDiskFunction,
  makeSpiralFunction,
  makeHyperbolicFunction,
  makeDiamondFunction,
  makeExFunction,
  makeBentFunction,
  makeJuliaFunction,
  makeFisheyeFunction,
  makeExponentialFunction,
  makeCosineFunction,
  makeBubbleFunction,
  makeTangentFunction,
  makeCylinderFunction,
  makeRotationFunction,
  makeShearFunction,
  makeTranslationFunction,
  makeScaleFunction,
  makeIdentityFunction,
  makeJuliaScopeFunction,
  makeIteratedMandelbrotFunction,
  makeCircleFunction,
  makeHypocycloidFunction,
  makeEpicycloidFunction,
  makeEpitrochoidFunction,
  makeCardioidFunction,
  makeSierpinskiFunction,
  makeSplitFunction,
  makeCpowFunction,
  makeTwintrianFunction,
  makeCrossFunction,
  makeBladeFunction,
  makeRaysFunction,
  makeRectanglesFunction,
  makeTriangleFunction,
} from '../transform';
import { pickColorMapValue, RainbowColormap } from '../utils/color';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { enableMathApprox } from '../utils/math';
import { mkdirs } from '../utils/fs';


const OUTPUT_DIRECTORY = `${__dirname}/../output/transformations`;
mkdirs(OUTPUT_DIRECTORY);

enableMathApprox();

const TRANSFORMATIONS = {
  identity: makeIdentityFunction(),
  translation: makeTranslationFunction(0.5, 0.5),
  rotation: makeRotationFunction(Math.PI / 4),
  shear: makeShearFunction(1, 0),
  scale: makeScaleFunction(0.5, 0.5),
  linear0: makeLinearFunction(1, 0, 0, 0, 1, 0),
  linear1: makeLinearFunction(0.8, 0.9, 0, 0, 0.8, 0),
  linear2: makeLinearFunction(0.7, -0.7, 0, 0.7, 0.7, 0),
  mobius: makeMobiusFunction(complex(0.5, -0.8), complex(0.8, -0.2), complex(0.8, -0.5), complex(0.2, 0.1)),
  sinusoidal: makeSinusoidalFunction(),
  spherical: makeSphericalFunction(),
  magnify: makeMagnifyFunction(),
  swirl: makeSwirlFunction(0),
  horseshoe: makeHorseshoeFunction(),
  polar: makePolarFunction(),
  handkerchief: makeHandkerchiefFunction(),
  disk: makeDiskFunction(),
  spiral: makeSpiralFunction(),
  hyperbolic: makeHyperbolicFunction(),
  diamond: makeDiamondFunction(),
  ex: makeExFunction(),
  julia: makeJuliaFunction(complex(-0.9, 0.4)),
  bent: makeBentFunction(),
  wave1: makeWaveFunction(0.5, 0.25, 0, 1),
  wave2: makeWaveFunction(0, 1, 0.5, 0.25),
  wave3: makeWaveFunction(0.5, 0.5, 0.5, 0.25),
  fisheye: makeFisheyeFunction(),
  popcorn: makePopCornFunction(1, 1),
  exponential: makeExponentialFunction(),
  power: makePowerFunction(0),
  cosine: makeCosineFunction(),
  rings: makeRingsFunction(0.5),
  fan: makeFanFunction(0.5, Math.PI * 1.2),
  blob: makeBlobFunction(1, -1, 2 * Math.PI),
  pdj: makePDJFunction(1, 2, 1, 2),
  bubble: makeBubbleFunction(),
  cylinder: makeCylinderFunction(),
  perspective: makePerspectiveFunction(1, 1),
  ngon: makeNgonFunction(5, 5, 0.5, 0.5),
  curl: makeCurlFunction(1, 1),
  tangent: makeTangentFunction(),
  circle: makeCircleFunction(1),
  juliaScope: makeJuliaScopeFunction(5, 2),
  iteratedMandelbrot: makeIteratedMandelbrotFunction(5, 3),
  epicycloid: makeEpicycloidFunction(4),
  epitrochoid: makeEpitrochoidFunction(0.1, 0.3, 0.05),
  hypocycloid: makeHypocycloidFunction(4),
  cardioid: makeCardioidFunction(0.5),
  triangle: makeTriangleFunction(0.5),
  sierpinski: makeSierpinskiFunction(0.5),
  split: makeSplitFunction(0.1, 0.1),
  cpow: makeCpowFunction(complex(0.96, 0.2)),
  twintrian: makeTwintrianFunction(1),
  cross: makeCrossFunction(3),
  blade: makeBladeFunction(1),
  rays: makeRaysFunction(1),
  rectangles: makeRectanglesFunction(0.5, 0.25),
};

const plotTransformedGrid = async (width, height, transformKey) => {
  const image = createImage(width, height, 255, 255, 255, 255);
  const buffer = image.getImage().data;
  const transform = TRANSFORMATIONS[transformKey];

  // we want to draw only the pixels that belongs to a grid composed of one line every 2 pixels
  // so we increment 2 by 2 pixels
  for (let i = 0; i < width; i += 2) {
    for (let j = 0; j < height; j += 2) {
      // each pixel of the grid is mapped to the bi-unit domain...
      const [ x, y ] = mapPixelToDomain(i, j, width, height, BI_UNIT_DOMAIN);

      // ... the transformation is then applied...
      const z = complex(x, y);
      const fz = transform(z);

      // ... then the transformed 2d value is re-mapped to the pixel domain
      const [ fx, fy ] = mapDomainToPixel(fz.re, fz.im, BI_UNIT_DOMAIN, width, height);

      // transformed pixels that are outside the image are discarded
      if (fx < 0 || fy < 0 || fx >= width || fy >= height) {
        continue;
      }

      // the pixel color will be based on the distance from the center to the non-transformed pixel (√2 is max.)
      const color = pickColorMapValue(modulus(z) / Math.SQRT2, RainbowColormap);

      // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
      const idx = (fx + fy * width) * 4;
      buffer[idx + 0] = color[0];
      buffer[idx + 1] = color[1];
      buffer[idx + 2] = color[2];
      buffer[idx + 3] = 255;
    }
  }

  await saveImage(image, `${OUTPUT_DIRECTORY}/transform-${transformKey}.png`);
};

// plot all transformations
Object.keys(TRANSFORMATIONS).forEach(key => plotTransformedGrid(1024, 1024, key));
