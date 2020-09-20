import PngImage from 'pngjs-image';
import { clampInt } from './misc';
import { PlotBuffer, PlotDomain } from './types';


export const createImage = (width: number, height: number, r = 0, g = 0, b = 0, a = 255) => {
  const image = PngImage.createImage(width, height);
  fillPicture(image.getImage().data, width, height, r, g, b, a);
  return image;
};

export const saveImage = async (image, path: string) => {
  return new Promise((resolve, reject) => {
    image.writeImage(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const saveImageBuffer = async (buffer: PlotBuffer, width: number, height: number, path: string) => {
  const image = PngImage.createImage(width, height);
  image.getImage().data.set(buffer);
  await saveImage(image, path);
};

export const readImage = async (path: string, scale = 1): Promise<{ buffer: PlotBuffer, width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    PngImage.readImage(path, (err, image) => {
      if (err) {
        reject(err);
      } else {
        const width = image.getWidth();
        const height = image.getHeight();
        const imageData = image.getImage().data;

        let buffer = imageData;
        if (scale != 1) {
          buffer = new Float32Array(imageData.length);
          imageData.forEach((x, i) => buffer[i] = x / scale);
        }

        const result = { width, height, buffer };
        resolve(result);
      }
    });
  });
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

export const fillPicture = (buffer: Buffer, width: number, height: number, r = 0, g = 0, b = 0, a = 255) => {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      buffer[idx + 0] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }
};

export type ForEachPixelFunction = (r: number, g: number, b: number, a: number, x: number, y: number, idx: number, buffer: PlotBuffer) => void;

export const forEachPixel = (buffer: PlotBuffer, width: number, height: number, f: ForEachPixelFunction) => {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      f(buffer[idx + 0], buffer[idx + 1], buffer[idx + 2], buffer[idx + 3], i, j, idx, buffer);
    }
  }
};

export type ReducePixelFunction = (current: number, r: number, g: number, b: number, a: number, x: number, y: number, idx: number, buffer: PlotBuffer) => number;

export const reducePixels = (buffer: PlotBuffer, width: number, height: number, f: ReducePixelFunction, initialValue = 0) => {
  let current = initialValue;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      current = f(current, buffer[idx + 0], buffer[idx + 1], buffer[idx + 2], buffer[idx + 3], i, j, idx, buffer);
    }
  }
  return current;
};


export const normalizeBuffer = (buffer: PlotBuffer, width: number, height: number, factor = 1) => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  forEachPixel(buffer, width, height, (r, g, b) => {
    min = Math.min(min, r, g, b);
    max = Math.max(max, r, g, b);
  });

  if (min === max) {
    return buffer;
  }

  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    buffer[idx + 0] = ((r - min) / (max - min)) * factor;
    buffer[idx + 1] = ((g - min) / (max - min)) * factor;
    buffer[idx + 2] = ((b - min) / (max - min)) * factor;
    buffer[idx + 3] = a;
  });
  return buffer;
};

export const clampBuffer = (buffer: PlotBuffer, width: number, height: number, min: number, max: number) => {
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    buffer[idx + 0] = Math.max(min, Math.min(r, max));
    buffer[idx + 1] = Math.max(min, Math.min(g, max));
    buffer[idx + 2] = Math.max(min, Math.min(b, max));
    buffer[idx + 3] = a;
  });
  return buffer;
};

export const getPixelValue = (buffer: PlotBuffer, width: number, height: number, x: number, y: number, offset: number) => {
  const idx = (clampInt(x, 0, width - 1) + clampInt(y, 0, height - 1) * width) * 4 + offset;
  return buffer[idx];
};

export const setPixelValue = (buffer: PlotBuffer, width: number, height: number, x: number, y: number, offset: number) => {
  const idx = (clampInt(x, 0, width - 1) + clampInt(y, 0, height - 1) * width) * 4 + offset;
  return buffer[idx];
};

export const setPixelValues = (buffer: PlotBuffer, width: number, height: number, x: number, y: number, r: number, g: number, b: number, a = 255) => {
  const idx = (clampInt(x, 0, width - 1) + clampInt(y, 0, height - 1) * width) * 4;
  buffer[idx + 0] = r;
  buffer[idx + 1] = g;
  buffer[idx + 2] = b;
  buffer[idx + 3] = a;
};
