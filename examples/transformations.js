import Complex from 'complex.js';

import { createImage, saveImage, mapPixelToDomain, mapDomainToPixel } from '../utils/picture';
import { makeFan, makeCardioid, makeNgon, makeRings, makePower, makePopCorn, makeWave, makeSwirl, makeBlob, makePDJ, makePerspective, makeCurl, makeLinear, makeMobius, makeSinusoidal, makeSpherical, makeMagnify, makeHorseshoe, makePolar, makeHandkerchief, makeDisk, makeSpiral, makeHyperbolic, makeDiamond, makeEx, makeBent, makeJulia, makeFisheye, makeExponential, makeCosine, makeBubble, makeTangent, makeCylinder, makeRotation, makeShear, makeTranslation, makeScale, makeIdentity, makeMercator, makeSpiral2, makeHypocycloid, makeButterfly, makeJuliaScope, makeIteratedJulia, makeIteratedMandelbrot } from '../transform';
import { pickColorMapValue, RAINBOW_COLORMAP } from '../utils/color';
import { BI_UNIT_DOMAIN } from '../utils/domain';

const TRANSFORMATIONS = {
  identity: makeIdentity(),
  translation: makeTranslation(0.5, 0.5),
  rotation: makeRotation(Math.PI / 4),
  shear: makeShear(1, 0),
  scale: makeScale(0.5, 0.5),
  linear0: makeLinear(1, 0, 0, 0, 1, 0),
  linear1: makeLinear(0.8, 0.9, 0, 0, 0.8, 0),
  linear2: makeLinear(0.7, -0.7, 0, 0.7, 0.7, 0),
  mobius: makeMobius(new Complex(0.5,-0.8),new Complex(0.8,-0.2),new Complex(0.8,-0.5),new Complex(0.2,0.1)),
  sinusoidal: makeSinusoidal(),
  spherical: makeSpherical(),
  magnify: makeMagnify(),
  swirl: makeSwirl(0),
  horseshoe: makeHorseshoe(),
  polar: makePolar(),
  handkerchief: makeHandkerchief(),
  disk: makeDisk(),
  spiral: makeSpiral(),
  hyperbolic: makeHyperbolic(),
  diamond: makeDiamond(),
  ex: makeEx(),
  julia: makeJulia(new Complex(-0.9, 0.4)),
  bent: makeBent(),
  wave1: makeWave(0.5, 0.25, 0, 1),
  wave2: makeWave(0, 1, 0.5, 0.25),
  wave3: makeWave(0.5, 0.5, 0.5, 0.25),
  fisheye: makeFisheye(),
  popcorn: makePopCorn(1, 1),
  exponential: makeExponential(),
  power: makePower(0),
  cosine: makeCosine(),
  rings: makeRings(0.5),
  fan: makeFan(0.5, Math.PI * 1.2),
  blob: makeBlob(1, -1, 2 * Math.PI),
  pdj: makePDJ(1, 2, 1, 2),
  bubble: makeBubble(),
  cylinder: makeCylinder(),
  perspective: makePerspective(1, 1),
  ngon: makeNgon(5, 5, 0.5, 0.5),
  curl: makeCurl(1, 1),
  tangent: makeTangent(),
  cardioid: makeCardioid(0.5),
  hypocycloid: makeHypocycloid(0.2, 4),
  juliaScope: makeJuliaScope(5, 2),
  iteratedMandelbrot: makeIteratedMandelbrot(5, 3),
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
      const [x, y] = mapPixelToDomain(i, j, width, height, BI_UNIT_DOMAIN);

      // ... the transformation is then applied...
      const z = new Complex(x, y);
      const fz = transform(z);

      // ... then the transformed 2d value is re-mapped to the pixel domain
      const [fx, fy] = mapDomainToPixel(fz.re, fz.im, BI_UNIT_DOMAIN, width, height);

      // transformed pixels that are outside the image are discarded
      if (fx < 0 || fy < 0 || fx >= width || fy >= height) {
        continue;
      }
      
      // the pixel color will be based on the distance from the center to the non-transformed pixel (√2 is max.)
      const color = pickColorMapValue(z.abs() / Math.SQRT2, RAINBOW_COLORMAP);

      // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
      const idx = (fx + fy * width) * 4;
      buffer[idx + 0] = color[0];
      buffer[idx + 1] = color[1];
      buffer[idx + 2] = color[2];
      buffer[idx + 3] = 255;
    }
  }

  await saveImage(image, `transform-${transformKey}.png`);
};

// plot all transformations
Object.keys(TRANSFORMATIONS).forEach(key => plotTransformedGrid(1024, 1024, key));
