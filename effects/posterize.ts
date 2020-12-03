import { hslToRgb, rgbToHsl } from '../utils/color';
import { getClosestColor } from '../utils/palette';
import { forEachPixel } from '../utils/picture';
import { Color } from '../utils/types';

export const applyPalettePosterize = (input: Float32Array, width: number, height: number, palette: Color[]) => {
  const output = new Float32Array(input);
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const idx = (i + j * width) * 4;
      const r = input[idx + 0];
      const g = input[idx + 1];
      const b = input[idx + 2];
      const color = getClosestColor(palette, r, g, b);

      output[idx + 0] = color[0];
      output[idx + 1] = color[1];
      output[idx + 2] = color[2];
    }
  }
  return output;
};

export const applyPosterize = (input: Float32Array, width: number, height: number, levels = 6) => {
  const binWidth = 1 / levels;
  const offset = binWidth / 2;

  const output = new Float32Array(width * height * 4);
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = Math.floor(r * levels + offset) / levels;
    output[idx + 1] = Math.floor(g * levels + offset) / levels;
    output[idx + 2] = Math.floor(b * levels + offset) / levels;
    output[idx + 3] = a;
  });
  return output;
};

export const applyLuminosityPosterize = (input: Float32Array, width: number, height: number, levels = 10, phiq = 5) => {
  const binWidth = 1 / levels;
  const offset = binWidth / 2;

  const output = new Float32Array(input);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      const r = input[idx + 0];
      const g = input[idx + 1];
      const b = input[idx + 2];

      const [ h, s, l ] = rgbToHsl(r, g, b);
      const nearestLum = (Math.floor(l * levels) / levels) + offset;

      const quantizedLum = nearestLum + (binWidth/2) * Math.tanh(phiq * (l - nearestLum));

      const rgb = hslToRgb(h, s, quantizedLum);
      output[idx + 0] = rgb[0];
      output[idx + 1] = rgb[1];
      output[idx + 2] = rgb[2] ;
      output[idx + 3] = input[idx + 3];
    }
  }
  return output;
};


type Pixel = [ number, number, number, number ];

const medianCut = (pixels: Pixel[], depth: number, buckets: Pixel[][]) => {
  if (pixels.length === 0) {
    throw new Error('not enough pixels');
  }
  if (depth === 0) {
    buckets.push(pixels);
    return;
  }

  const minColor = [ 1, 1, 1 ];
  const maxColor = [ 0, 0, 0 ];
  
  pixels.forEach((p) => {
    minColor[0] = Math.min(minColor[0], p[0]);
    minColor[1] = Math.min(minColor[1], p[1]);
    minColor[2] = Math.min(minColor[2], p[2]);
    maxColor[0] = Math.max(maxColor[0], p[0]);
    maxColor[1] = Math.max(maxColor[1], p[1]);
    maxColor[2] = Math.max(maxColor[2], p[2]);
  });

  const rRange = maxColor[0] - minColor[0];
  const gRange = maxColor[1] - minColor[1];
  const bRange = maxColor[2] - minColor[2];

  let highestRangeChannel = 0;
  if (gRange >= rRange && gRange >= bRange) {
    highestRangeChannel = 1;
  } else if (bRange >= rRange && bRange >= gRange) {
    highestRangeChannel = 2;
  } else if (rRange >= bRange && rRange >= gRange) {
    highestRangeChannel = 0;
  }

  pixels.sort((a, b) => a[highestRangeChannel] - b[highestRangeChannel]);
  const median = Math.trunc((pixels.length + 1) / 2);

  medianCut(pixels.slice(0, median), depth - 1, buckets);
  medianCut(pixels.slice(median, pixels.length), depth - 1, buckets);
};

export const applyMedianCutPosterize = (input: Float32Array, width: number, height: number, levels = 16) => {
  const depth = Math.log2(levels);
  if (Number.isInteger(depth) === false) {
    throw new Error('levels must be a power of two');
  }

  const flattened: Pixel[] = [];
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      flattened.push([
        input[idx + 0],
        input[idx + 1],
        input[idx + 2],
        idx,
      ]);
    }
  }

  const buckets: Pixel[][] = [];
  medianCut(flattened, depth, buckets);
  
  const output = new Float32Array(input.length);
  buckets.forEach((bucket) => {
    let r = 0;
    let g = 0;
    let b = 0;
    bucket.forEach((pixel) => {
      r += pixel[0];
      g += pixel[1];
      b += pixel[2];
    });
    r /= bucket.length;
    g /= bucket.length;
    b /= bucket.length;
    bucket.forEach((pixel) => {
      const idx = pixel[3];
      output[idx + 0] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
      output[idx + 3] = input[idx + 3];
    });
  });

  return output;
};
