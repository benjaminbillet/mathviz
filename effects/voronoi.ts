import { fillPicture } from '../utils/picture';
import { Color } from '../utils/types';
import { applyGaussianBlur } from './blur';
import { applyLuminanceMap } from './luminanceMap';
import { applySobelDerivative } from './derivative';
import { clamp, shuffleArray } from '../utils/misc';
import { complex, ComplexNumber } from '../utils/complex';
import { drawFilledCircle, drawFilledPolygon, drawPolygon } from '../utils/raster';
import { computeVoronoi } from '../utils/voronoi';
import { makePlotter } from '../utils/plotter';


export const applyVoronoi = (input: Float32Array, width: number, height: number, fillCells = true, drawWires = false, drawSites = false, maxPoints = 2500, sobelThreshold = 0.1, pointDensityThreshold = 0.2, pointRate = 0.8) => {
  const blur = applyGaussianBlur(input, width, height, 25);
  const grayscale = applyLuminanceMap(blur, width, height);
  const sobel = applySobelDerivative(grayscale, width, height);

  for (let i = 0; i < sobel.length; i++) {
    if (sobel[i] < sobelThreshold) {
      sobel[i] = 0;
    }
  }

  const points = extractPoints(sobel, width, height, pointDensityThreshold, pointRate, maxPoints);
  const voronoiSites = computeVoronoi(points, width, height);

  const output = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  const plotter = makePlotter(output, width, height);

  voronoiSites.forEach(({ site, polygon }) => {
    const idx = (Math.trunc(site.re) + Math.trunc(site.im) * width) * 4;
    const color: Color = [input[idx + 0], input[idx + 1], input[idx + 2], input[idx + 3]];

    polygon = polygon.map(c => c.trunc());
    if (fillCells) {
      drawFilledPolygon(polygon, color, plotter);
    }
    if (drawWires) {
      drawPolygon(polygon, [1,1,1,1], plotter);
    }
    if (drawSites) {
      site = site.trunc();
      drawFilledCircle(site.re, site.im, 2, [1,1,1,1], plotter);
    }
  });

  return output;
};

const extractPoints = (input: Float32Array, width: number, height: number, pointDensityThreshold: number, pointRate: number, maxPoints: number): ComplexNumber[] => {
  const points = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let sum = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const kx = clamp(x + i, 0, width - 1);
          const ky = clamp(y + j, 0, height - 1);
          sum += input[(kx + ky * width) * 4]; 
        }
      }

      if (sum / 9 > pointDensityThreshold) {
        points.push(complex(x, y));
      }
		}
	}

  const limit = Math.min(points.length * pointRate, maxPoints);
  return shuffleArray(points).slice(0, limit);
};
