import { bilinear, bicubic, bicosine } from './interpolation';
import { getPixelValue } from './picture';

export const pixelNearestNeighbor = (buffer: Float32Array, width: number, height: number, x: number, y: number, offset: number) => {
  const x1 = Math.trunc(x);
  const y1 = Math.trunc(y);
  return getPixelValue(buffer, width, height, x1, y1, offset);
};

export const pixelBilinear = (buffer: Float32Array, width: number, height: number, x: number, y: number, offset: number) => {
  const x1 = Math.trunc(x);
  const y1 = Math.trunc(y);

  const p00 = getPixelValue(buffer, width, height, x1, y1, offset);
  const p10 = getPixelValue(buffer, width, height, x1 + 1, y1, offset);
  const p01 = getPixelValue(buffer, width, height, x1, y1 + 1, offset);
  const p11 = getPixelValue(buffer, width, height, x1 + 1, y1 + 1, offset);

  return bilinear(x - x1, y - y1, p00, p10, p01, p11);
};

export const pixelBicosine = (buffer: Float32Array, width: number, height: number, x: number, y: number, offset: number) => {
  const x1 = Math.trunc(x);
  const y1 = Math.trunc(y);

  const p00 = getPixelValue(buffer, width, height, x1, y1, offset);
  const p10 = getPixelValue(buffer, width, height, x1 + 1, y1, offset);
  const p01 = getPixelValue(buffer, width, height, x1, y1 + 1, offset);
  const p11 = getPixelValue(buffer, width, height, x1 + 1, y1 + 1, offset);

  return bicosine(x - x1, y - y1, p00, p10, p01, p11);
};

export const pixelBicubic = (buffer: Float32Array, width: number, height: number, x: number, y: number, offset: number) => {
  const x1 = Math.trunc(x);
  const y1 = Math.trunc(y);

  const p00 = getPixelValue(buffer, width, height, x1 - 1, y1 - 1, offset);
  const p01 = getPixelValue(buffer, width, height, x1 - 1, y1, offset);
  const p02 = getPixelValue(buffer, width, height, x1 - 1, y1 + 1, offset);
  const p03 = getPixelValue(buffer, width, height, x1 - 1, y1 + 2, offset);

  const p10 = getPixelValue(buffer, width, height, x1, y1 - 1, offset);
  const p11 = getPixelValue(buffer, width, height, x1, y1, offset);
  const p12 = getPixelValue(buffer, width, height, x1, y1 + 1, offset);
  const p13 = getPixelValue(buffer, width, height, x1, y1 + 2, offset);

  const p20 = getPixelValue(buffer, width, height, x1 + 1, y1 - 1, offset);
  const p21 = getPixelValue(buffer, width, height, x1 + 1, y1, offset);
  const p22 = getPixelValue(buffer, width, height, x1 + 1, y1 + 1, offset);
  const p23 = getPixelValue(buffer, width, height, x1 + 1, y1 + 2, offset);

  const p30 = getPixelValue(buffer, width, height, x1 + 2, y1 - 1, offset);
  const p31 = getPixelValue(buffer, width, height, x1 + 2, y1, offset);
  const p32 = getPixelValue(buffer, width, height, x1 + 2, y1 + 1, offset);
  const p33 = getPixelValue(buffer, width, height, x1 + 2, y1 + 2, offset);

  return bicubic(x - x1, y - y1, p00, p10, p20, p30, p01, p11, p21, p31, p02, p12, p22, p32, p03, p13, p23, p33);
};

export const UpscaleSamplers = {
  Bilinear: pixelBilinear,
  Bicosine: pixelBicosine,
  Bicubic: pixelBicubic,
  NearestNeighbor: pixelNearestNeighbor,
};

export const upscale = (input: Float32Array, width: number, height: number, scale: number, sampler = UpscaleSamplers.Bicubic) => {
  if (scale <= 1) {
    return input;
  }

  const outputWidth = Math.trunc(scale * width);
  const outputHeight = Math.trunc(scale * height);
  return upscale2(input, width, height, outputWidth, outputHeight, sampler);
};

export const upscale2 = (input: Float32Array, width: number, height: number, outputWidth: number, outputHeight: number, sampler = UpscaleSamplers.Bicubic) => {
  if (outputWidth === width && outputHeight === height) {
    return input;
  }
  if (outputWidth < width || outputHeight < height) {
    throw new Error('Upscale only');
  }

  const output = new Float32Array(outputWidth * outputHeight * 4);
  for (let x = 0; x < outputWidth; x++) {
    for (let y = 0; y < outputHeight; y++) {
      const px = x * (width - 1) / (outputWidth - 1);
      const py = y * (height - 1) / (outputHeight - 1);

      const idx = (x + y * outputWidth) * 4;
      output[idx + 0] = sampler(input, width, height, px, py, 0);
      output[idx + 1] = sampler(input, width, height, px, py, 1);
      output[idx + 2] = sampler(input, width, height, px, py, 2);
      output[idx + 3] = 1; // TODO alpha?
    }
  }

  return output;
};
