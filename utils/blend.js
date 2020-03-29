import * as D3Color from 'd3-color';

import { forEachPixel } from './picture';
import { chebyshev2d } from './distance';
import { distanceCenterMask } from './mask';
import { cosine, linear } from './interpolation';

export const blendCosine = (buffer1, buffer2, gradientBuffer, width, height, gradFactor = 1) => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(gradientBuffer, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = cosine(r * gradFactor, buffer1[idx + 0], buffer2[idx + 0]);
    output[idx + 1] = cosine(g * gradFactor, buffer1[idx + 1], buffer2[idx + 1]);
    output[idx + 2] = cosine(b * gradFactor, buffer1[idx + 2], buffer2[idx + 2]);
    output[idx + 3] = a;

    /* output[idx + 0] = (1 - Math.cos(r * gradFactor * Math.PI)) / 2;
    output[idx + 1] = (1 - Math.cos(g * gradFactor * Math.PI)) / 2;
    output[idx + 2] = (1 - Math.cos(b * gradFactor * Math.PI)) / 2;
    output[idx + 3] = a;

    output[idx + 0] = buffer1[idx + 0] * (1 - output[idx + 0]) + buffer2[idx + 0] * output[idx + 0];
    output[idx + 1] = buffer1[idx + 1] * (1 - output[idx + 1]) + buffer2[idx + 1] * output[idx + 1];
    output[idx + 2] = buffer1[idx + 2] * (1 - output[idx + 2]) + buffer2[idx + 2] * output[idx + 2];*/
  });
  return output;
};

export const blendCosineCenter = (buffer1, buffer2, width, height, distanceFunc = chebyshev2d, gradFactor = 1) => {
  const mask = distanceCenterMask(distanceFunc, width, height, 4);
  return blendCosine(buffer1, buffer2, mask, width, height, gradFactor);
};

export const blendLinear = (buffer1, buffer2, gradientBuffer, width, height, gradFactor = 1) => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(gradientBuffer, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = linear(r * gradFactor, buffer1[idx + 0], buffer2[idx + 0]);
    output[idx + 1] = linear(g * gradFactor, buffer1[idx + 1], buffer2[idx + 1]);
    output[idx + 2] = linear(b * gradFactor, buffer1[idx + 2], buffer2[idx + 2]);
    output[idx + 3] = a;

    /* output[idx + 0] = r * gradFactor;
    output[idx + 1] = g * gradFactor;
    output[idx + 2] = b * gradFactor;
    output[idx + 3] = a;

    output[idx + 0] = buffer1[idx + 0] * (1 - output[idx + 0]) + buffer2[idx + 0] * output[idx + 0];
    output[idx + 1] = buffer1[idx + 1] * (1 - output[idx + 1]) + buffer2[idx + 1] * output[idx + 1];
    output[idx + 2] = buffer1[idx + 2] * (1 - output[idx + 2]) + buffer2[idx + 2] * output[idx + 2];*/
  });
  return output;
};

export const blendLinearCenter = (buffer1, buffer2, width, height, distanceFunc = chebyshev2d, gradFactor = 1) => {
  const mask = distanceCenterMask(distanceFunc, width, height, 4);
  return blendLinear(buffer1, buffer2, mask, width, height, gradFactor);
};

const bimap = (buffer1, buffer2, f) => {
  return buffer1.map((x, i) => f(x, buffer2[i], i, buffer1, buffer2));
};

const pixelBiEach = (buffer1, buffer2, f) => {
  for (let i = 0; i < buffer1.length; i++) {
    if ((i + 1) % 4 !== 0) {
      f(buffer1[i - 3], buffer1[i - 2], buffer1[i - 1], buffer1[i - 0], buffer2[i - 3], buffer2[i - 2], buffer2[i - 1], buffer2[i - 0], i);
    }
  }
};

/* const makeBlendBuffer = (f) => {
  return (buffer1, buffer2) => bimap(buffer1, buffer2, f);
};*/

export const blendAdd = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => Math.min(a + b, 1));
};

export const blendSubstract = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => Math.max(a - b, 0));
};

export const blendMultiply = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => a * b);
};

export const blendDivide = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => Math.min(a / b, 1));
};

export const blendDifference = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => Math.abs(a - b));
};

export const blendExclusion = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => a + b - (2 * a * b));
};

export const blendScreen = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => 1 - ((1 - a) * (1 - b)));
};

export const blendOverlay = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => {
    if (a < 0.5) {
      return 2 * a * b;
    }
    return 1 - (2 * (1 - a) * (1 - b));
  });
};

export const blendHardLight = (buffer1, buffer2) => {
  return blendOverlay(buffer2, buffer1);
};

export const blendSoftLight = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => {
    if (b < 0.5) {
      return 2 * a * b + a * a * (1 - 2 * b);
    }
    return Math.sqrt(a) * (2 * b - 1) + 2 * a * (1 - b);
  });
};

export const blendVividLight = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => {
    if (b < 0.5) {
      b = b * 2;
      return b === 0 ? b : Math.max(1 - ((1 - a) / b), 0); // color burn
    }
    b = 2 * (b - 0.5);
    return a === 1 ? b : Math.min(a / (1 - b), 1); // color dodge
  });
};

export const blendPinLight = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => {
    if (b < 0.5) {
      return Math.min(a, b); // darken
    }
    return Math.max(a, b); // lighten
  });
};

export const blendLighten = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => Math.max(a, b));
};

export const blendDarken = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => Math.min(a, b));
};

export const blendAverage = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => (a + b) * 0.5);
};

export const blendColorDodge = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => a === 1 ? b : Math.min(a / (1 - b), 1));
};

export const blendLinearDodge = (buffer1, buffer2) => {
  return blendAdd(buffer1, buffer2);
};

export const blendColorBurn = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => b === 0 ? b : Math.max(1 - ((1 - a) / b), 0));
};

export const blendLinearBurn = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => a + b - 1);
};

export const blendPhoenix = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => Math.min(a, b) - Math.max(a, b) + 1);
};

export const blendNegation = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => 1 - Math.abs(1 - a - b));
};

export const blendReflect = (buffer1, buffer2) => {
  return bimap(buffer1, buffer2, (a, b) => b === 1 ? b : Math.min(a * a / (1 - b), 1));
};

export const blendHue = (buffer1, buffer2) => {
  const output = new Float32Array(buffer1.length);
  pixelBiEach(buffer1, buffer2, (r1, g1, b1, a1, r2, g2, b2, a2, idx) => {
    const hsl1 = D3Color.hsl(D3Color.rgb(r1 * 255, g1 * 255, b1 * 255));
    const hsl2 = D3Color.hsl(D3Color.rgb(r2 * 255, g2 * 255, b2 * 255));
    const blended = D3Color.rgb(D3Color.hsl(hsl2.h, hsl1.s, hsl1.l));
    output[idx + 0] = blended.r / 255;
    output[idx + 1] = blended.g / 255;
    output[idx + 2] = blended.b / 255;
  });
  return output;
};

export const blendSaturation = (buffer1, buffer2) => {
  const output = new Float32Array(buffer1.length);
  pixelBiEach(buffer1, buffer2, (r1, g1, b1, a1, r2, g2, b2, a2, idx) => {
    const hsl1 = D3Color.hsl(D3Color.rgb(r1 * 255, g1 * 255, b1 * 255));
    const hsl2 = D3Color.hsl(D3Color.rgb(r2 * 255, g2 * 255, b2 * 255));
    const blended = D3Color.rgb(D3Color.hsl(hsl1.h, hsl2.s, hsl1.l));
    output[idx + 0] = blended.r / 255;
    output[idx + 1] = blended.g / 255;
    output[idx + 2] = blended.b / 255;
  });
  return output;
};

export const blendLuminosity = (buffer1, buffer2) => {
  const output = new Float32Array(buffer1.length);
  pixelBiEach(buffer1, buffer2, (r1, g1, b1, a1, r2, g2, b2, a2, idx) => {
    const hsl1 = D3Color.hsl(D3Color.rgb(r1 * 255, g1 * 255, b1 * 255));
    const hsl2 = D3Color.hsl(D3Color.rgb(r2 * 255, g2 * 255, b2 * 255));
    const blended = D3Color.rgb(D3Color.hsl(hsl1.h, hsl1.s, hsl2.l));
    output[idx + 0] = blended.r / 255;
    output[idx + 1] = blended.g / 255;
    output[idx + 2] = blended.b / 255;
  });
  return output;
};

export const blendColor = (buffer1, buffer2) => {
  const output = new Float32Array(buffer1.length);
  pixelBiEach(buffer1, buffer2, (r1, g1, b1, a1, r2, g2, b2, a2, idx) => {
    const hsl1 = D3Color.hsl(D3Color.rgb(r1 * 255, g1 * 255, b1 * 255));
    const hsl2 = D3Color.hsl(D3Color.rgb(r2 * 255, g2 * 255, b2 * 255));
    const blended = D3Color.rgb(D3Color.hsl(hsl2.h, hsl2.s, hsl1.l));
    output[idx + 0] = blended.r / 255;
    output[idx + 1] = blended.g / 255;
    output[idx + 2] = blended.b / 255;
  });
  return output;
};

export const blendWithOpacity = (buffer1, buffer2, f, opacity) => {
  const buffer3 = f(buffer1, buffer2);
  buffer3.forEach((x, i) => opacity * x + (1 - opacity) * buffer1[i]);
};

