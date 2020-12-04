import { fillPicture } from '../utils/picture';
import { getLuminance } from '../utils/color';
import { Color } from '../utils/types';
import { applyLuminanceMap } from './luminanceMap';
import { shuffleArray } from '../utils/misc';
import { complex, ComplexNumber } from '../utils/complex';
import { drawBresenhamCircle, drawFilledCircle } from '../utils/raster';
import { applyWeightedLloydRelaxation } from '../utils/lloyd-relaxation';
import { random } from '../utils/random';
import { propagateDiffusionError } from './dithering';
import { makePlotter } from '../utils/plotter';


export const applyStippling = (input: Float32Array, width: number, height: number, fillCircle = true, preprocess = true, circleRadius = 3, maxPoints = 2500) => {
  const grayscale = applyLuminanceMap(input, width, height);

  // preprocess following http://archive.bridgesmathart.org/2015/bridges2015-267.pdf
  if (preprocess) {
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const idx = (i + j * width) * 4;
        const r = input[idx + 0];
        const g = input[idx + 1];
        const b = input[idx + 2];

        grayscale[idx + 0] = r * r;
        grayscale[idx + 1] = g * g;
        grayscale[idx + 2] = b * b;

        const er = r - grayscale[idx + 0];
        const eg = g - grayscale[idx + 1];
        const eb = b - grayscale[idx + 2];
        propagateDiffusionError(grayscale, width, height, i, j, er, eg, eb);
      }
    }
  }

  const points = extractPoints(grayscale, width, height, maxPoints);

  const voronoiSites = applyWeightedLloydRelaxation(points, width, height, (z) => {
    const idx = (Math.trunc(z.re) + Math.trunc(z.im) * width) * 4;
    return getLuminance(input[idx + 0], input[idx + 1], input[idx + 2]);
  }, 0.1);

  const output = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  const plotter = makePlotter(output, width, height);

  voronoiSites.forEach(({ site, polygon }) => {
    site = site.trunc();
    const idx = (Math.trunc(site.re) + Math.trunc(site.im) * width) * 4;
    const color: Color = [input[idx + 0], input[idx + 1], input[idx + 2], input[idx + 3]];

    if (fillCircle) {
      drawFilledCircle(site.re, site.im, circleRadius, [1,1,1,1], plotter);
    } else {
      drawBresenhamCircle(site.re, site.im, circleRadius, [1,1,1,1], plotter);
    }
  });

  return output;
};

const extractPoints = (input: Float32Array, width: number, height: number, maxPoints: number): ComplexNumber[] => {
  const points = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (x + y * width) * 4;
      const lum = getLuminance(input[i + 0], input[i + 1], input[i + 2]);
      if (random() < lum) {
        points.push(complex(x, y));
      }
    }
  }

  // const limit = Math.min(points.length * pointRate, maxPoints);
  return shuffleArray(points).slice(0, maxPoints);
};
