import { fillPicture, forEachPixel } from './picture';
import { chebyshev2d } from './distance';
import { distanceCenterMask } from './mask';
import { cosine, linear } from './interpolation';
import { Color } from './types';
import { hslToRgb, rgbToHsl } from './color';

export const alphaBlendingFunction = (src: Color, dst: Color, out?: Color): Color => {
  const srcA = src[3];
  const dstA = dst[3];
  
  const outA = srcA + dstA * (1 - srcA);

  let outR = 0;
  let outG = 0;
  let outB = 0;
  if (outA > 0) {
    outR = (src[0] * srcA + dst[0] * (1 - srcA)) / outA;
    outG = (src[1] * srcA + dst[1] * (1 - srcA)) / outA;
    outB = (src[2] * srcA + dst[2] * (1 - srcA)) / outA;
  }

  if (out == null) {
    out = [ outR, outG, outB, outA ];
  } else {
    out[0] = outR;
    out[1] = outG;
    out[2] = outB;
    out[3] = outA;
  }

  return out;
};

export const blendCosine = (buffer1: Float32Array, buffer2: Float32Array, gradientBuffer: Float32Array, width: number, height: number, gradFactor = 1): Float32Array => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(gradientBuffer, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = cosine(r * gradFactor, buffer1[idx + 0], buffer2[idx + 0]);
    output[idx + 1] = cosine(g * gradFactor, buffer1[idx + 1], buffer2[idx + 1]);
    output[idx + 2] = cosine(b * gradFactor, buffer1[idx + 2], buffer2[idx + 2]);
    output[idx + 3] = a;
  });
  return output;
};

export const blendCosineCenter = (buffer1: Float32Array, buffer2: Float32Array, width: number, height: number, distanceFunc = chebyshev2d, gradFactor = 1): Float32Array => {
  const mask = distanceCenterMask(distanceFunc, width, height);
  return blendCosine(buffer1, buffer2, mask, width, height, gradFactor);
};

export const blendLinear = (buffer1: Float32Array, buffer2: Float32Array, gradientBuffer: Float32Array, width: number, height: number, gradFactor = 1): Float32Array => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(gradientBuffer, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = linear(r * gradFactor, buffer1[idx + 0], buffer2[idx + 0]);
    output[idx + 1] = linear(g * gradFactor, buffer1[idx + 1], buffer2[idx + 1]);
    output[idx + 2] = linear(b * gradFactor, buffer1[idx + 2], buffer2[idx + 2]);
    output[idx + 3] = a;
  });
  return output;
};

export const blendLinearCenter = (buffer1: Float32Array, buffer2: Float32Array, width: number, height: number, distanceFunc = chebyshev2d, gradFactor = 1): Float32Array => {
  const mask = distanceCenterMask(distanceFunc, width, height);
  return blendLinear(buffer1, buffer2, mask, width, height, gradFactor);
};

type BimapFunction = (v1: number, v2: number, i: number, buffer1: Float32Array, buffer2: Float32Array) => number;
const bimap = (buffer1: Float32Array, buffer2: Float32Array, f: BimapFunction) => {
  const output = fillPicture(new Float32Array(buffer1.length), 0, 0, 0, 1);
  for (let i = 0; i < buffer1.length; i += 4) {
    output[i + 0] = f(buffer1[i + 0], buffer2[i + 0], i, buffer1, buffer2);
    output[i + 1] = f(buffer1[i + 1], buffer2[i + 1], i, buffer1, buffer2);
    output[i + 2] = f(buffer1[i + 2], buffer2[i + 2], i, buffer1, buffer2);
    output[i + 3] = buffer1[i + 3]; // TODO alpha?
  }
  return output;
};

type PixelBiEachFunction = (r1: number, g1: number, b1: number, a1: number, r2: number, g2: number, b2: number, a2: number, i: number) => void;
const pixelBiEach = (buffer1: Float32Array, buffer2: Float32Array, f: PixelBiEachFunction) => {
  for (let i = 0; i < buffer1.length; i += 4) {
    f(buffer1[i + 0], buffer1[i + 1], buffer1[i + 2], buffer1[i + 3], buffer2[i + 0], buffer2[i + 1], buffer2[i + 2], buffer2[i + 3], i);
  }
};

export const blendAdd = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => Math.min(a + b, 1));
};

export const blendSubstract = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => Math.max(a - b, 0));
};

export const blendMultiply = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => a * b);
};

export const blendDivide = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => Math.min(a / b, 1));
};

export const blendDifference = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, blendDifferenceFunction);
};
export const blendDifferenceFunction = (a: number, b: number): number => {
  return Math.abs(a - b);
};

export const blendExclusion = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => a + b - (2 * a * b));
};

export const blendScreen = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, blendScreenFunction);
};
export const blendScreenFunction = (a: number, b: number): number => {
  return 1 - ((1 - a) * (1 - b));
};

export const blendOverlay = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => {
    if (a < 0.5) {
      return 2 * a * b;
    }
    return 1 - (2 * (1 - a) * (1 - b));
  });
};

export const blendHardLight = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return blendOverlay(buffer2, buffer1);
};

export const blendSoftLight = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => {
    if (b < 0.5) {
      return 2 * a * b + a * a * (1 - 2 * b);
    }
    return Math.sqrt(a) * (2 * b - 1) + 2 * a * (1 - b);
  });
};

export const blendVividLight = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => {
    if (b < 0.5) {
      b = b * 2;
      return b === 0 ? b : Math.max(1 - ((1 - a) / b), 0); // color burn
    }
    b = 2 * (b - 0.5);
    return a === 1 ? b : Math.min(a / (1 - b), 1); // color dodge
  });
};

export const blendPinLight = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => {
    if (b < 0.5) {
      return Math.min(a, b); // darken
    }
    return Math.max(a, b); // lighten
  });
};

export const blendLighten = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => Math.max(a, b));
};

export const blendDarken = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => Math.min(a, b));
};

export const blendAverage = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, blendAverageFunction);
};
export const blendAverageFunction = (a: number, b: number): number => {
  return (a + b) * 0.5;
};

export const blendColorDodge = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => a === 1 ? b : Math.min(a / (1 - b), 1));
};

export const blendLinearDodge = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return blendAdd(buffer1, buffer2);
};

export const blendColorBurn = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => b === 0 ? b : Math.max(1 - ((1 - a) / b), 0));
};

export const blendLinearBurn = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => a + b - 1);
};

export const blendPhoenix = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => Math.min(a, b) - Math.max(a, b) + 1);
};

export const blendNegation = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => 1 - Math.abs(1 - a - b));
};

export const blendReflect = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  return bimap(buffer1, buffer2, (a, b) => b === 1 ? b : Math.min(a * a / (1 - b), 1));
};

export const blendHue = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  const output = new Float32Array(buffer1.length);
  pixelBiEach(buffer1, buffer2, (r1, g1, b1, a1, r2, g2, b2, a2, idx) => {
    const hsl1 = rgbToHsl(r1, g1, b1);
    const hsl2 = rgbToHsl(r2, g2, b2);
    const blended = hslToRgb(hsl2[0], hsl1[1], hsl1[2]);
    output[idx + 0] = blended[0];
    output[idx + 1] = blended[1];
    output[idx + 2] = blended[2];
    output[idx + 3] = a1; // TODO alpha?
  });
  return output;
};

export const blendSaturation = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  const output = new Float32Array(buffer1.length);
  pixelBiEach(buffer1, buffer2, (r1, g1, b1, a1, r2, g2, b2, a2, idx) => {
    const hsl1 = rgbToHsl(r1, g1, b1);
    const hsl2 = rgbToHsl(r2, g2, b2);
    const blended = hslToRgb(hsl1[0], hsl2[1], hsl1[2]);
    output[idx + 0] = blended[0];
    output[idx + 1] = blended[1];
    output[idx + 2] = blended[2];
    output[idx + 3] = a1; // TODO alpha?
  });
  return output;
};

export const blendLuminosity = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  const output = new Float32Array(buffer1.length);
  pixelBiEach(buffer1, buffer2, (r1, g1, b1, a1, r2, g2, b2, a2, idx) => {
    const hsl1 = rgbToHsl(r1, g1, b1);
    const hsl2 = rgbToHsl(r2, g2, b2);
    const blended = hslToRgb(hsl1[0], hsl1[1], hsl2[2]);
    output[idx + 0] = blended[0];
    output[idx + 1] = blended[1];
    output[idx + 2] = blended[2];
    output[idx + 3] = a1; // TODO alpha?
  });
  return output;
};

export const blendColor = (buffer1: Float32Array, buffer2: Float32Array): Float32Array => {
  const output = new Float32Array(buffer1.length);
  pixelBiEach(buffer1, buffer2, (r1, g1, b1, a1, r2, g2, b2, a2, idx) => {
    const hsl1 = rgbToHsl(r1, g1, b1);
    const hsl2 = rgbToHsl(r2, g2, b2);
    const blended = hslToRgb(hsl2[0], hsl2[1], hsl1[2]);
    output[idx + 0] = blended[0];
    output[idx + 1] = blended[1];
    output[idx + 2] = blended[2];
    output[idx + 3] = a1; // TODO alpha?
  });
  return output;
};
