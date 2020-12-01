import { PNG } from 'pngjs';
import fs from 'fs';

import { ComplexNumber } from './complex';
import { clamp, mapRange } from './misc';
import { PlotDomain } from './types';
import { convertRGBAToUnit, convertUnitToRGBA } from './color';

export type Image = {
  width: number,
  height: number,
  buffer: Float32Array,
}

export const fillPicture = (buffer: Float32Array, r = 0, g = 0, b = 0, a = 1) => {
  for (let i = 0; i < buffer.length; i += 4) {
    buffer[i + 0] = r;
    buffer[i + 1] = g;
    buffer[i + 2] = b;
    buffer[i + 3] = a;
  }
  return buffer;
};

export const fillAlpha = (buffer: Float32Array, a = 1) => {
  for (let i = 0; i < buffer.length; i += 4) {
    buffer[i + 3] = a;
  }
  return buffer;
};

export const createImage = (width: number, height: number, r = 0, g = 0, b = 0, a = 1) => {
  const buffer = fillPicture(new Float32Array(width * height * 4), r, g, b, a);
  return { width, height, buffer };
};

export const saveImage = (image: Image, path: string) => {
  saveImageBuffer(image.buffer, image.width, image.height, path);
};

export const saveImageBuffer = (buffer: Float32Array, width: number, height: number, path: string) => {
  const pngData = PNG.sync.write({ width, height, data: convertUnitToRGBA(buffer) });
  fs.writeFileSync(path, pngData);
};

export const saveSingleChannelBuffer = (buffer: Float32Array, width: number, height: number, path: string) => {
  const output = new Float32Array(width * height * 4).fill(1);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const inIdx = i + j * width;
      const outIdx = (i + j * width) * 4;
      output[outIdx + 0] = buffer[inIdx];
      output[outIdx + 1] = buffer[inIdx];
      output[outIdx + 2] = buffer[inIdx];
      output[outIdx + 3] = 1;
    }
  }
  saveImageBuffer(output, width, height, path);
};

export const readImage = (path: string): Image => {
  const pngData = fs.readFileSync(path);
  const { width, height, data } = PNG.sync.read(pngData);
  return { width, height, buffer: convertRGBAToUnit(data) };
};

export const mapPixelToDomain = (x: number, y: number, width: number, height: number, domain: PlotDomain) => {
  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;

  const xRatio = domainWidth / width;
  const yRatio = domainHeight / height;
  return [
    domain.xmin + (x * xRatio),
    domain.ymin + (y * yRatio),
  ];
};

export const mapPixelToComplexDomain = (x: number, y: number, width: number, height: number, domain: PlotDomain) => {
  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;

  const xRatio = domainWidth / width;
  const yRatio = domainHeight / height;
  return new ComplexNumber(domain.xmin + (x * xRatio), domain.ymin + (y * yRatio));
};

export const mapDomainToPixel = (x: number, y: number, domain: PlotDomain, width: number, height: number) => {
  // optimization if domain is 0-1
  if (domain.xmin === 0 && domain.xmax === 1 && domain.ymin === 0 && domain.ymax === 1) {
    return [
      Math.trunc(x * width),
      Math.trunc(y * height),
    ];
  }

  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;

  const xRatio = (width - 1) / domainWidth;
  const yRatio = (height - 1) / domainHeight;
  return [
    Math.trunc((x - domain.xmin) * xRatio),
    Math.trunc((y - domain.ymin) * yRatio),
  ];
};

export const mapComplexDomainToPixel = (z: ComplexNumber, domain: PlotDomain, width: number, height: number) => {
  // optimization if domain is 0-1
  if (domain.xmin === 0 && domain.xmax === 1 && domain.ymin === 0 && domain.ymax === 1) {
    return new ComplexNumber(Math.trunc(z.re * width), Math.trunc(z.im * height));
  }

  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;

  const xRatio = (width - 1) / domainWidth;
  const yRatio = (height - 1) / domainHeight;
  return new ComplexNumber(Math.trunc((z.re - domain.xmin) * xRatio), Math.trunc((z.im - domain.ymin) * yRatio));
};

export const getPictureSizeFromWidth = (width: number, domain: PlotDomain) => {
  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;
  const ratio = domainHeight / domainWidth;
  return [ width, Math.round(width * ratio) ];
};

export const getPictureSizeFromHeight = (height: number, domain: PlotDomain) => {
  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;
  const ratio = domainWidth / domainHeight;
  return [ Math.round(height * ratio), height ];
};

export const getPictureSize = (max: number, domain: PlotDomain, even = false) => {
  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;

  let result = null;
  if (domainWidth >= domainHeight) {
    result = getPictureSizeFromWidth(max, domain);
  } else {
    result = getPictureSizeFromHeight(max, domain);
  }

  if (even) {
    if (result[0] % 2 === 1) {
      result[0]++;
    }
    if (result[1] % 2 === 1) {
      result[1]++;
    }
  }

  return result;
};

export type ForEachPixelFunction = (r: number, g: number, b: number, a: number, x: number, y: number, idx: number, buffer: Float32Array) => void;

export const forEachPixel = (buffer: Float32Array, width: number, height: number, f: ForEachPixelFunction) => {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      f(buffer[idx + 0], buffer[idx + 1], buffer[idx + 2], buffer[idx + 3], i, j, idx, buffer);
    }
  }
};

export type ReducePixelFunction = (current: number, r: number, g: number, b: number, a: number, x: number, y: number, idx: number, buffer: Float32Array) => number;

export const reducePixels = (buffer: Float32Array, width: number, height: number, f: ReducePixelFunction, initialValue = 0) => {
  let current = initialValue;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      current = f(current, buffer[idx + 0], buffer[idx + 1], buffer[idx + 2], buffer[idx + 3], i, j, idx, buffer);
    }
  }
  return current;
};

export const normalizeBuffer = (buffer: Float32Array, width: number, height: number, outMin = 0, outMax = 1) => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  forEachPixel(buffer, width, height, (r, g, b) => {
    min = Math.min(min, r, g, b);
    max = Math.max(max, r, g, b);
  });

  if (min === outMin && max === outMax) {
    return buffer;
  }

  return mapRangeBuffer(buffer, width, height, min, max, outMin, outMax);
};

export const mapRangeBuffer = (buffer: Float32Array, width: number, height: number, inMin = 0, inMax = 1, outMin = 0, outMax = 1) => {
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    buffer[idx + 0] = mapRange(r, inMin, inMax, outMin, outMax);
    buffer[idx + 1] = mapRange(g, inMin, inMax, outMin, outMax);
    buffer[idx + 2] = mapRange(b, inMin, inMax, outMin, outMax);
    buffer[idx + 3] = a;
  });
  return buffer;
};

export const clampBuffer = (buffer: Float32Array, width: number, height: number, min: number, max: number) => {
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    buffer[idx + 0] = clamp(r, min, max);
    buffer[idx + 1] = clamp(g, min, max);
    buffer[idx + 2] = clamp(b, min, max);
    buffer[idx + 3] = a;
  });
  return buffer;
};

export const getPixelValue = (buffer: Float32Array, width: number, height: number, x: number, y: number, offset: number) => {
  const idx = (clamp(x, 0, width - 1) + clamp(y, 0, height - 1) * width) * 4 + offset;
  return buffer[idx];
};

export const setPixelValue = (buffer: Float32Array, width: number, height: number, x: number, y: number, offset: number) => {
  const idx = (clamp(x, 0, width - 1) + clamp(y, 0, height - 1) * width) * 4 + offset;
  return buffer[idx];
};

export const setPixelValues = (buffer: Float32Array, width: number, height: number, x: number, y: number, r: number, g: number, b: number, a = 1) => {
  const idx = (clamp(x, 0, width - 1) + clamp(y, 0, height - 1) * width) * 4;
  buffer[idx + 0] = r;
  buffer[idx + 1] = g;
  buffer[idx + 2] = b;
  buffer[idx + 3] = a;
};
