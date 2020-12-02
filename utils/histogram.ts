import { clamp } from './misc';
import { ColorHistogram } from './types';

export const makeHistogram = (input: Float32Array, width: number, height: number, nbBins = 256): ColorHistogram => {
  const nbPixels = width * height;
  const nbChannels = Math.trunc(input.length / nbPixels);
  const binSize = Math.trunc(256 / nbBins);

  const histogram = new Array(nbChannels).fill(null).map(() => new Uint32Array(nbBins).fill(0));

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const idx = (x + y * width) * 4;
      for (let channel = 0; channel < nbChannels; channel++) {
        const lum = input[idx + channel] * 255;
        const bin = Math.trunc(lum / binSize);
        histogram[channel][bin]++;
      }
    }
  }
  return histogram;
};

export const makeRegionHistogram = (input: Float32Array, width: number, height: number, x1: number, y1: number, x2: number, y2: number, nbBins = 256): ColorHistogram => {
  const nbPixels = width * height;
  const nbChannels = Math.trunc(input.length / nbPixels);
  const binSize = Math.trunc(256 / nbBins);

  const histogram = new Array(nbChannels).fill(null).map(() => new Uint32Array(nbBins).fill(0));
  for (let x = x1; x < x2; x++) {
    for (let y = y1; y < y2; y++) {
      const idx = (clamp(x, 0, width - 1) + clamp(y, 0, height - 1) * width) * 4;
      for (let channel = 0; channel < nbChannels; channel++) {
        const lum = input[idx + channel] * 255;
        const bin = Math.trunc(lum / binSize);
        histogram[channel][bin]++;
      }
    }
  }
  return histogram;
};


