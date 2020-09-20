import { normalizeBuffer, forEachPixel } from '../utils/picture';
import { PlotBuffer } from '../utils/types';

export const applyDensityMap = (input: PlotBuffer, width: number, height: number) => {
  const nbBins = Math.max(width, height);
  const bins = new Uint32Array(nbBins).fill(0);

  // create an histogram with the given number of beans
  forEachPixel(input, width, height, (r, g, b) => {
    bins[Math.trunc(r * (nbBins - 1))]++;
    bins[Math.trunc(g * (nbBins - 1))]++;
    bins[Math.trunc(b * (nbBins - 1))]++;
  });

  // remap each pixel with the value of the histogram
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    input[idx + 0] = bins[Math.trunc(r * (nbBins - 1))];
    input[idx + 1] = bins[Math.trunc(g * (nbBins - 1))];
    input[idx + 2] = bins[Math.trunc(b * (nbBins - 1))];
  });

  normalizeBuffer(input, width, height);
  return input;
};
