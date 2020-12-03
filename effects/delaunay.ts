import { fillPicture } from '../utils/picture';
import { Color } from '../utils/types';
import { applyGaussianBlur } from './blur';
import { applyLuminanceMap } from './luminanceMap';
import { applySobelDerivative } from './derivative';
import { clamp, shuffleArray } from '../utils/misc';
import { complex, ComplexNumber } from '../utils/complex';
import { computeDelaunayTriangulation } from '../utils/delaunay';
import { drawBresenhamLine, drawFilledPolygon } from '../utils/raster';
import { makePlotter } from '../utils/plotter';


export const applyDelaunay = (input: Float32Array, width: number, height: number, fillCells = true, drawWires = false, sobelThreshold = 0.1, pointDensityThreshold = 0.2, pointRate = 0.8, maxPoints = 2500) => {
  const blur = applyGaussianBlur(input, width, height, 25);
  const grayscale = applyLuminanceMap(blur, width, height);
  const sobel = applySobelDerivative(grayscale, width, height);

  for (let i = 0; i < sobel.length; i++) {
    if (sobel[i] < sobelThreshold) {
      sobel[i] = 0;
    }
  }

  const points = extractPoints(sobel, width, height, pointDensityThreshold, pointRate, maxPoints);
  const triangles = computeDelaunayTriangulation(width, height, points);

  const output = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  const plotter = makePlotter(output, width, height);

  triangles.forEach(t => {
    const cx = Math.trunc((t.points[0].re + t.points[1].re + t.points[2].re) / 3);
		const cy = Math.trunc((t.points[0].im + t.points[1].im + t.points[2].im) / 3);
    const idx = (cx + cy * width) * 4;
    const color: Color = [input[idx + 0], input[idx + 1], input[idx + 2], input[idx + 3]];

    if (fillCells) {
      drawFilledPolygon(t.points, color, plotter);
    }
    if (drawWires) {
      drawBresenhamLine(t.points[0].re, t.points[0].im, t.points[1].re, t.points[1].im, [1,1,1,1], plotter);
      drawBresenhamLine(t.points[1].re, t.points[1].im, t.points[2].re, t.points[2].im, [1,1,1,1], plotter);
      drawBresenhamLine(t.points[2].re, t.points[2].im, t.points[0].re, t.points[0].im, [1,1,1,1], plotter);
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
