import { complex, modulus } from '../utils/complex';

import { createImage, saveImage, mapPixelToDomain, mapDomainToPixel, readImage, saveImageBuffer } from '../utils/picture';
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
  makeSplitFunction,
  makeCpowFunction,
  makeTwintrianFunction,
  makeCrossFunction,
  makeBladeFunction,
  makeRaysFunction,
  makeRectanglesFunction,
  makeTriangleFunction,
  makeHeartFunction,
  makeFan2Function,
  makePolynomialFunction
} from '../transform';
import { pickColorMapValue, RainbowColormap } from '../utils/color';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { enableMathApprox } from '../utils/math';
import { mkdirs } from '../utils/fs';
import { Index, PixelPlotter, PlotBuffer, Transform2D } from '../utils/types';
import { drawBresenhamLine } from '../utils/raster';

const OUTPUT_DIRECTORY = `${__dirname}/../output/transformations`;
mkdirs(OUTPUT_DIRECTORY);

const TRANSFORMATIONS: Index<Transform2D> = {
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
  swirl: makeSwirlFunction(1, 0),
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
  fan2: makeFan2Function(0.5, 1),
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
  split: makeSplitFunction(0.1, 0.1),
  cpow: makeCpowFunction(complex(0.96, 0.2)),
  twintrian: makeTwintrianFunction(1),
  cross: makeCrossFunction(3),
  blade: makeBladeFunction(1),
  rays: makeRaysFunction(1),
  rectangles: makeRectanglesFunction(0.5, 0.25),
  heart: makeHeartFunction(),
  polynomial: makePolynomialFunction(0, 0.2, -0.3, -1.6, 0, 0.8, -2.4)
};

const makePlotter = (buffer: PlotBuffer, width: number, height: number): PixelPlotter => {
  return (x, y, color) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }
    x = Math.round(x);
    y = Math.round(y);

    const idx = (y * width + x) * 4;
    buffer[idx + 0] = color[0];
    buffer[idx + 1] = color[1];
    buffer[idx + 2] = color[2];
  };
};

const plotTransformedGrid = async (width: number, height: number, transformKey: string) => {
  const image = createImage(width, height, 255, 255, 255, 255);
  const buffer = image.getImage().data;
  const transform = TRANSFORMATIONS[transformKey];

  const cellSize = 10;
  const gridWidth = Math.trunc(width / cellSize);
  const gridHeight = Math.trunc(height / cellSize);

  const plot = makePlotter(buffer, width, height);

  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      const p1 = mapPixelToDomain(i * cellSize, j * cellSize, width, height, BI_UNIT_DOMAIN);
      const p2 = mapPixelToDomain((i + 1) * cellSize, j * cellSize, width, height, BI_UNIT_DOMAIN);
      const p3 = mapPixelToDomain(i * cellSize, (j + 1) * cellSize, width, height, BI_UNIT_DOMAIN);
      const p4 = mapPixelToDomain((i + 1) * cellSize, (j + 1) * cellSize, width, height, BI_UNIT_DOMAIN);

      const fz1 = transform(complex(p1[0], p1[1]));
      const fz2 = transform(complex(p2[0], p2[1]));
      const fz3 = transform(complex(p3[0], p3[1]));
      const fz4 = transform(complex(p4[0], p4[1]));

      const fp1 = mapDomainToPixel(fz1.re, fz1.im, BI_UNIT_DOMAIN, width, height);
      const fp2 = mapDomainToPixel(fz2.re, fz2.im, BI_UNIT_DOMAIN, width, height);
      const fp3 = mapDomainToPixel(fz3.re, fz3.im, BI_UNIT_DOMAIN, width, height);
      const fp4 = mapDomainToPixel(fz4.re, fz4.im, BI_UNIT_DOMAIN, width, height);

      if ((fp1[0] < 0 || fp1[1] < 0 || fp1[0] >= width || fp1[1] >= height) && (fp4[0] < 0 || fp4[1] < 0 || fp4[0] >= width || fp4[1] >= height)) {
        continue;
      }

      // the pixel color will be based on the distance from the center to the non-transformed pixel (√2 is max.)
      const color = pickColorMapValue(modulus(complex(p1[0], p1[1])) / Math.SQRT2, RainbowColormap);

      // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
      drawBresenhamLine(fp1[0], fp1[1], fp2[0], fp2[1], color, plot);
      drawBresenhamLine(fp1[0], fp1[1], fp3[0], fp3[1], color, plot);
      drawBresenhamLine(fp4[0], fp4[1], fp2[0], fp2[1], color, plot);
      drawBresenhamLine(fp4[0], fp4[1], fp3[0], fp3[1], color, plot);
    }
  }

  await saveImage(image, `${OUTPUT_DIRECTORY}/transform-grid-${transformKey}.png`);
};

const plotTransformedGrid2 = async (width: number, height: number, transformKey: string) => {
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

  await saveImage(image, `${OUTPUT_DIRECTORY}/transform-grid-${transformKey}2.png`);
};

// plot all transformations
Object.keys(TRANSFORMATIONS).forEach(key => plotTransformedGrid(1024, 1024, key));
Object.keys(TRANSFORMATIONS).forEach(key => plotTransformedGrid2(1024, 1024, key));
