import { bilinear, bicubic } from './interpolation';
import { getPixelValue } from './picture';

export const pixelNearestNeighbor = (buffer, width, height, x, y, offset) => {
  const x1 = Math.trunc(x);
  const y1 = Math.trunc(y);
  return getPixelValue(buffer, width, height, x1, y1, offset);
};

export const pixelBilinear = (buffer, width, height, x, y, offset) => {
  const x1 = Math.trunc(x);
  const y1 = Math.trunc(y);

  const p00 = getPixelValue(buffer, width, height, x1, y1, offset);
  const p10 = getPixelValue(buffer, width, height, x1 + 1, y1, offset);
  const p01 = getPixelValue(buffer, width, height, x1, y1 + 1, offset);
  const p11 = getPixelValue(buffer, width, height, x1 + 1, y1 + 1, offset);

  return bilinear(x - x1, y - y1, p00, p10, p01, p11);
};

export const pixelBicubic = (buffer, width, height, x, y, offset) => {
  const x1 = Math.trunc(x);
  const y1 = Math.trunc(y);

  let p00 = getPixelValue(buffer, width, height, x1 - 1, y1 - 1, offset);
  let p01 = getPixelValue(buffer, width, height, x1 - 1, y1, offset);
  let p02 = getPixelValue(buffer, width, height, x1 - 1, y1 + 1, offset);
  let p03 = getPixelValue(buffer, width, height, x1 - 1, y1 + 2, offset);

  let p10 = getPixelValue(buffer, width, height, x1, y1 - 1, offset);
  let p11 = getPixelValue(buffer, width, height, x1, y1, offset);
  let p12 = getPixelValue(buffer, width, height, x1, y1 + 1, offset);
  let p13 = getPixelValue(buffer, width, height, x1, y1 + 2, offset);

  let p20 = getPixelValue(buffer, width, height, x1 + 1, y1 - 1, offset);
  let p21 = getPixelValue(buffer, width, height, x1 + 1, y1, offset);
  let p22 = getPixelValue(buffer, width, height, x1 + 1, y1 + 1, offset);
  let p23 = getPixelValue(buffer, width, height, x1 + 1, y1 + 2, offset);

  let p30 = getPixelValue(buffer, width, height, x1 + 2, y1 - 1, offset);
  let p31 = getPixelValue(buffer, width, height, x1 + 2, y1, offset);
  let p32 = getPixelValue(buffer, width, height, x1 + 2, y1 + 1, offset);
  let p33 = getPixelValue(buffer, width, height, x1 + 2, y1 + 2, offset);

  return bicubic(x - x1, y - y1, p00, p10, p20, p30, p01, p11, p21, p31, p02, p12, p22, p32, p03, p13, p23, p33);
};

const SAMPLERS = {
  Bilinear: pixelBilinear,
  Bicubic: pixelBicubic,
  NearestNeighbor: pixelNearestNeighbor,
};

export const upscale = (input, width, height, scale, sampler = 'Bicubic') => {
  if (scale <= 1) {
    return input;
  }

  const outputWidth = Math.trunc(scale * width);
  const outputHeight = Math.trunc(scale * height);
  return upscale2(input, width, height, outputWidth, outputHeight, sampler);
};

export const upscale2 = (input, width, height, outputWidth, outputHeight, sampler = 'Bicubic') => {
  const output = new Float64Array(outputWidth * outputHeight * 4);
  const samplerImpl = SAMPLERS[sampler];

  for (let x = 0; x < outputWidth; x++) {
    for (let y = 0; y < outputHeight; y++) {
      const px = x * (width - 1) / (outputWidth - 1);
      const py = y * (height - 1) / (outputHeight - 1);

      const idx = (x + y * outputWidth) * 4;
      output[idx + 0] = samplerImpl(input, width, height, px, py, 0);
      output[idx + 1] = samplerImpl(input, width, height, px, py, 1);
      output[idx + 2] = samplerImpl(input, width, height, px, py, 2);
      output[idx + 3] = 255;
    }
  }

  return output;
};
