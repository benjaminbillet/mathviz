import { PlotBuffer, ColorHistogram, SingleChannelHistogram } from "./types";

export const makeHistogram = (input: PlotBuffer, width: number, height: number, nbBins = 256) => {
  const nbPixels = width * height;
  const nbChannels = input.length / nbPixels;
  const binSize = Math.trunc(256 / nbBins);

  return new Array(nbChannels).fill(null).map(() => {
    const histogram = new Uint32Array(nbBins).fill(0);
    input.forEach((lum: number) => {
      const bin = Math.trunc(lum / binSize);
      histogram[bin]++;
    });
    return histogram;
  });
};

export const makeRegionHistogram = (input: PlotBuffer, width: number, height: number, x1: number, y1: number, x2: number, y2: number, nbBins = 256): ColorHistogram => {
  const nbPixels = width * height;
  const nbChannels = input.length / nbPixels;
  const binSize = Math.trunc(256 / nbBins);

  return new Array(nbChannels).fill(null).map(() => {
    const histogram: SingleChannelHistogram = new Uint32Array(nbBins).fill(0);
    for (let x = x1; x < x2; x++) {
      for (let y = y1; y < y2; y++) {
        let idx;
        if (x >= width && y < height) {
          idx = (y * width + (width - 1));
        } else if (y >= height && x < width) {
          idx = ((height - 1) * width + x);
        } else if (y >= height && x >= width) {
          idx = (height * width) - 1;
        } else {
          idx = (y * width + x);
        }
        const lum = input[idx];
        const bin = Math.trunc(lum / binSize);
        histogram[bin]++;
      }
    }
    return histogram;
  });
};


export const clipHistogram = (hist: ColorHistogram, clipLimit: number, redistribute = false) => {
  return hist.map((histChannel) => {
    let excess = 0;

    // clip histogram and compute the number of clipped points
    histChannel = histChannel.map((value) => {
      if (value > clipLimit) {
        excess += value - clipLimit;
        return clipLimit;
      }
      return value;
    });
    if (redistribute === false) {
      return histChannel;
    }

    // redistribute excess points in each bins
    const excessPerBin = Math.trunc(excess / histChannel.length); // average bin increment
    const binLimit = clipLimit - excessPerBin; // upper limit for bins
    // console.log(histChannel, clipLimit, binLimit, excessPerBin, excess)

    histChannel = histChannel.map((value) => {
      if (value > binLimit) {
        excess -= value - binLimit;
        return clipLimit;
      }
      excess -= excessPerBin;
      return value + excessPerBin;
    });

    // redistribute remaining excess
    let current = 0;
    let nbFull = 0;
    while (excess > 0) {
      if (current >= histChannel.length) {
        current = 0;
      }
      if (histChannel[current] < clipLimit) {
        histChannel[current]++;
        excess--;
      } else if (nbFull < histChannel.length) {
        nbFull++;
      } else {
        throw new Error('Cannot redistribute');
      }
      current++;
    }

    return histChannel;
  });
};

export const scaleHistogram = (hist: ColorHistogram, scale: number) => {
  return hist.map((histChannel) => {
    let sum = 0;
    return histChannel.map((value) => {
      sum += value;
      const newValue = sum * scale;
      // console.log(newValue, sum, value, scale);
      if (newValue > 255) {
        return 255;
      }
      return Math.trunc(newValue);
    });
  });
};

// https://webdocs.cs.ualberta.ca/~graphics/books/GraphicsGems/gemsiv/clahe.c
// http://cas.xav.free.fr/Graphics%20Gems%204%20-%20Paul%20S.%20Heckbert.pdf
// https://stackoverflow.com/questions/38346702/how-to-implement-contrast-limited-adaptive-histogram-equalization-using-clahe-in
export const performClahe = (input: PlotBuffer, width: number, height: number, output: PlotBuffer, nbRegionsX = 16, nbRegionsY = 16, nbBins = 256, clipLimit = 128) => {
  if (width % nbRegionsX !== 0 || height % nbRegionsY !== 0) {
    throw new Error('Invalid region size');
  }

  const regionXSize = Math.ceil(width / nbRegionsX);
  const regionYSize = Math.ceil(height / nbRegionsY);
  const regionArea = regionXSize * regionYSize;
  const regionXInvSize = 1 / regionXSize;
  const regionYInvSize = 1 / regionYSize;

  clipLimit = Math.trunc(clipLimit * regionArea / nbBins);
  const hists: SingleChannelHistogram[][] = [];

  // compute gray-level mappings for each contextual regions
  for (let x = 0; x < nbRegionsX; x++) {
    const bwColumnHists: SingleChannelHistogram[] = [];
    hists.push(bwColumnHists);
    for (let y = 0; y < nbRegionsY; y++) {
      // region boundaries
      const x1 = x * regionXSize;
      const y1 = y * regionYSize;
      const x2 = x1 + regionXSize;
      const y2 = y1 + regionYSize;

      // console.log(x, y);
      let hist = makeRegionHistogram(input, width, height, x1, y1, x2, y2, nbBins);
      // console.log(hist, hist.reduce((sum, x) => sum + x, 0));
      hist = clipHistogram(hist, clipLimit, true);
      // console.log(hist, hist.reduce((sum, x) => sum + x, 0));
      hist = scaleHistogram(hist, 255 / regionArea);
      // console.log(hist, hist.reduce((sum, x) => sum + x, 0));

      bwColumnHists.push(hist[0]); // single channel (gray)
    }
  }

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const lum = Math.floor(input[y * width + x]);

      const tx = x * regionXInvSize - 0.5;
      const ty = y * regionYInvSize - 0.5;

      const xl = Math.max(Math.floor(tx), 0);
      const xr = Math.min(xl+1, nbRegionsX - 1);

      const yt = Math.max(Math.floor(ty), 0);
      const yd = Math.min(yt+1, nbRegionsY - 1);

      const fx = tx - xl;
      const fy = ty - yt;

      const cdf11 = (hists[xl][yt][lum]);
      const cdf12 = (hists[xl][yd][lum]);
      const cdf21 = (hists[xr][yt][lum]);
      const cdf22 = (hists[xr][yd][lum]);

      const newLum = (1 - fx) * (1 - fy) * cdf11 + (1 - fx) * fy * cdf12 + fx * (1 - fy) * cdf21 + fx * fy * cdf22;
      const idx = (y * width + x);
      output[idx] = newLum;
    }
  }
};
