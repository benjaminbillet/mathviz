import { forEachPixel } from '../utils/picture';
import { toARGBInteger, fromARGBInteger, getLuminance } from '../utils/color';
import { Color, PlotBuffer, ARGBBuffer } from '../utils/types';

export const SortMode = {
  SortX: 'sort-x',
  SortY: 'sort-y',
  SortXY: 'sort-xy',
  SortYX: 'sort-yx',
};

export const findUpperThresoldSliceX = (x: number, y: number, input: PlotBuffer, width: number, height: number, threshold: number): Range => {
  // iterate along x axis, until finding a value above the threshold or the end of the line
  let xstart = x;

  let c = input[xstart + y * width];
  while (c < threshold) {
    xstart++;
    if (xstart >= width) {
      return { start: width - 1, end: width - 1 };
    }
    c = input[xstart + y * width];
  }

  // iterate along x axis, until finding a value below the threshold or the end of the line
  let xend = xstart + 1;

  c = input[xend + y * width];
  while (c > threshold) {
    xend++;
    if (xend >= width) {
      return { start: xstart, end: width - 1 };
    }
    c = input[xend + y * width];
  }
  xend = xend - 1;

  return { start: xstart, end: xend };
};


export const findUpperThresoldSliceY = (x: number, y: number, input: PlotBuffer, width: number, height: number, threshold: number): Range => {
  // iterate along y axis, until finding a value above the threshold or the end of the line
  let ystart = y;

  let c = input[x + ystart * width];
  while (c < threshold) {
    ystart++;
    if (ystart >= height) {
      return { start: height - 1, end: height - 1 };
    }
    c = input[x + ystart * width];
  }

  // iterate along y axis, until finding a value below the threshold or the end of the line
  let yend = ystart + 1;

  c = input[x + yend * width];
  while (c > threshold) {
    yend++;
    if (yend >= height) {
      return { start: ystart, end: height - 1 };
    }
    c = input[x + yend * width];
  }
  yend = yend - 1;

  return { start: ystart, end: yend };
};

export const findLowerThresoldSliceX = (x: number, y: number, input: PlotBuffer, width: number, height: number, threshold: number): Range => {
  // iterate along x axis, until finding a value above the threshold or the end of the line
  let xstart = x;

  let c = input[xstart + y * width];
  while (c > threshold) {
    xstart++;
    if (xstart >= width) {
      return { start: width, end: width };
    }
    c = input[xstart + y * width];
  }

  // iterate along x axis, until finding a value below the threshold or the end of the line
  let xend = xstart + 1;

  c = input[xend + y * width];
  while (c < threshold) {
    xend++;
    if (xend >= width) {
      return { start: xstart, end: width - 1 };
    }
    c = input[xend + y * width];
  }
  xend = xend - 1;

  return { start: xstart, end: xend };
};


export const findLowerThresoldSliceY = (x: number, y: number, input: PlotBuffer, width: number, height: number, threshold: number): Range => {
  // iterate along y axis, until finding a value above the threshold or the end of the line
  let ystart = y;

  let c = input[x + ystart * width];
  while (c > threshold) {
    ystart++;
    if (ystart >= height) {
      return { start: height, end: height };
    }
    c = input[x + ystart * width];
  }

  // iterate along y axis, until finding a value below the threshold or the end of the line
  let yend = ystart + 1;

  c = input[x + yend * width];
  while (c < threshold) {
    yend++;
    if (yend >= height) {
      return { start: ystart, end: height - 1 };
    }
    c = input[x + yend * width];
  }
  yend = yend - 1;

  return { start: ystart, end: yend };
};


export const sortSingleChannelPixels = (xstart: number, xend: number, ystart: number, yend: number, input: PlotBuffer, width: number, height: number) => {
  const sliceWidth = Math.max(1, xend - xstart);
  const sliceHeight = Math.max(1, yend - ystart);

  const pixels = new Float32Array(sliceWidth * sliceHeight).fill(0);
  for (let i = 0; i < sliceWidth; i++) {
    for (let j = 0; j < sliceHeight; j++) {
      pixels[i + j * sliceWidth] = input[(xstart + i) + (ystart + j) * width];
    }
  }

  pixels.sort((a, b) => a - b);
  return pixels;
};

export type Range = { start: number, end: number };
export type Slicer = (x: number, y: number, ...args: any[]) => Range;

export type Sorter = (xstart: number, xend: number, ystart: number, yend: number, ...args: any[]) => PlotBuffer;


export const configureSlicer = (func: Slicer, ...params: any[]): Slicer => {
  return (x, y) => func(x, y, ...params);
};

export const configureSorter = (func: Sorter, ...params: any[]): Sorter => {
  return (xstart, xend, ystart, yend) => func(xstart, xend, ystart, yend, ...params);
};


const sortX = (input: ARGBBuffer, width: number, height: number, delimiterFunction: Slicer, sortFunction: Sorter) => {
  for (let y = 0; y < height - 1; y++) {
    let xstart = 0;
    let xend = 0;

    while (xend < width - 1) {
      const range = delimiterFunction(xstart, y);
      xstart = range.start;
      xend = range.end;

      if (xstart >= width) {
        break;
      }

      const sortLength = xend - xstart;
      const pixels = sortFunction(xstart, xend, y, y + 1);

      for (let i = 0; i < sortLength; i++) {
        input[(xstart + i) + y * width] = pixels[i];
      }

      xstart = xend + 1;
    }
  }

  return input;
};

const sortY = (input: ARGBBuffer, width: number, height: number, delimiterFunction: Slicer, sortFunction: Sorter) => {
  for (let x = 0; x < width - 1; x++) {
    let ystart = 0;
    let yend = 0;

    while (yend < height - 1) {
      const range = delimiterFunction(x, ystart);
      ystart = range.start;
      yend = range.end;

      if (ystart >= height) {
        break;
      }

      const sortLength = yend - ystart;
      const pixels = sortFunction(x, x + 1, ystart, yend);

      for (let i = 0; i < sortLength; i++) {
        input[x + (ystart + i) * width] = pixels[i];
      }

      ystart = yend + 1;
    }
  }

  return input;
};

export const applyPixelSorting = (input: ARGBBuffer, width: number, height: number, mode: string, xDelimiterFunction: Slicer, yDelimiterFunction: Slicer, sortFunction: Sorter) => {
  switch (mode) {
  case SortMode.SortX:
    sortX(input, width, height, xDelimiterFunction, sortFunction);
    break;
  case SortMode.SortY:
    sortY(input, width, height, yDelimiterFunction, sortFunction);
    break;
  case SortMode.SortXY:
    sortX(input, width, height, xDelimiterFunction, sortFunction);
    sortY(input, width, height, yDelimiterFunction, sortFunction);
    break;
  case SortMode.SortYX:
    sortY(input, width, height, yDelimiterFunction, sortFunction);
    sortX(input, width, height, xDelimiterFunction, sortFunction);
    break;
  default:
    throw new Error(`Unknown mode: ${mode}`);
  }
  return input;
};

export const applyPixelARGBSortingBlack = (input: PlotBuffer, width: number, height: number, mode = SortMode.SortYX, blackThreshold = -10000000) => {
  const argbBuffer = toARGB(input, width, height);

  const xSlicer = configureSlicer(findUpperThresoldSliceX, argbBuffer, width, height, blackThreshold);
  const ySlicer = configureSlicer(findUpperThresoldSliceY, argbBuffer, width, height, blackThreshold);
  const sorter = configureSorter(sortSingleChannelPixels, argbBuffer, width, height);

  applyPixelSorting(argbBuffer, width, height, mode, xSlicer, ySlicer, sorter);

  return fromARGB(argbBuffer, width, height);
};


export const applyPixelARGBSortingWhite = (input: PlotBuffer, width: number, height: number, mode = SortMode.SortYX, whiteThreshold = -6000000) => {
  const argbBuffer = toARGB(input, width, height);

  const xSlicer = configureSlicer(findLowerThresoldSliceX, argbBuffer, width, height, whiteThreshold);
  const ySlicer = configureSlicer(findLowerThresoldSliceY, argbBuffer, width, height, whiteThreshold);
  const sorter = configureSorter(sortSingleChannelPixels, argbBuffer, width, height);

  applyPixelSorting(argbBuffer, width, height, mode, xSlicer, ySlicer, sorter);

  return fromARGB(argbBuffer, width, height);
};

export const applyPixelARGBSortingLuminance = (input: PlotBuffer, width: number, height: number, mode = SortMode.SortYX, lumThreshold = 60, lumFunction = getLuminance) => {
  const lumBuffer = new Uint8Array(width * height);
  forEachPixel(input, width, height, (r, g, b, a, i, j) => {
    lumBuffer[i + j * width] = lumFunction(r * 255, g * 255, b * 255);
  });

  const argbBuffer = toARGB(input, width, height);

  const xSlicer = configureSlicer(findUpperThresoldSliceX, lumBuffer, width, height, lumThreshold);
  const ySlicer = configureSlicer(findUpperThresoldSliceY, lumBuffer, width, height, lumThreshold);
  const sorter = configureSorter(sortSingleChannelPixels, argbBuffer, width, height);

  applyPixelSorting(argbBuffer, width, height, mode, xSlicer, ySlicer, sorter);

  return fromARGB(argbBuffer, width, height);
};

export const applyPixelARGBSortingBitmap = (input: PlotBuffer, width: number, height: number, bitmap: PlotBuffer, mode = SortMode.SortYX, threshold = 0.5) => {
  const argbBuffer = toARGB(input, width, height);

  const xSlicer = configureSlicer(findUpperThresoldSliceX, bitmap, width, height, threshold);
  const ySlicer = configureSlicer(findUpperThresoldSliceY, bitmap, width, height, threshold);
  const sorter = configureSorter(sortSingleChannelPixels, argbBuffer, width, height);

  applyPixelSorting(argbBuffer, width, height, mode, xSlicer, ySlicer, sorter);

  return fromARGB(argbBuffer, width, height);
};

const toARGB = (input: PlotBuffer, width: number, height: number): ARGBBuffer => {
  const argbBuffer = new Int32Array(width * height);
  forEachPixel(input, width, height, (r, g, b, a, i, j) => {
    argbBuffer[i + j * width] = toARGBInteger(r * 255, g * 255, b * 255, a * 255);
  });
  return argbBuffer;
};

const fromARGB = (input: ARGBBuffer, width: number, height: number) => {
  const output = new Float32Array(width * height * 4).fill(0);
  const rgba: Color = new Uint8Array(4).fill(0);
  forEachPixel(output, width, height, (r, g, b, a, i, j, idx) => {
    fromARGBInteger(input[i + j * width], rgba);
    output[idx + 0] = rgba[0] / 255;
    output[idx + 1] = rgba[1] / 255;
    output[idx + 2] = rgba[2] / 255;
    output[idx + 3] = rgba[3] / 255;
  });
  return output;
};

