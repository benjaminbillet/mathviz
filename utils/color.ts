import * as D3Color from 'd3-color';
import * as D3Interpolate from 'd3-interpolate';
import { clamp, clampInt } from './misc';
import { forEachPixel } from './picture';
import { Color, ColorMap, ColorMapFunction, RealToRealFunction } from './types';

// https://github.com/misonyo/pyifs

const DISPLAY_LUMINANCE_MAX = 200;
const SCALEFACTOR_NUMERATOR = 1.219 + Math.pow(DISPLAY_LUMINANCE_MAX * 0.25, 0.4);
export const applyContrastBasedScalefactor = (buffer: Float32Array, hitmap: Uint32Array, width: number, height: number, luminanceMean = 1, gamma = 0.45) => {
  // log-average luminance, as described in 'Photographic Tone Reproduction for Digital Images'
  // http://www.cmap.polytechnique.fr/~peyre/cours/x2005signal/hdr_photographic.pdf
  let logSum = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      const luminance = getLuminance(buffer[idx], buffer[idx + 1], buffer[idx + 2]) / luminanceMean;
      logSum += Math.log10(Math.max(luminance, 0.0001));
    }
  }

  const logAverage = Math.pow(10, (logSum / (width * height)));

  // scale factor, as described in 'A Contrast-Based Scalefactor for Luminance Display'
  // http://gaia.lbl.gov/btech/papers/35252.pdf
  const scalefactor = Math.pow(SCALEFACTOR_NUMERATOR / (1.219 + Math.pow(logAverage, 0.4)), 2.5) / DISPLAY_LUMINANCE_MAX;
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    buffer[idx + 0] = Math.max(r * scalefactor / luminanceMean, 0);
    buffer[idx + 1] = Math.max(g * scalefactor / luminanceMean, 0);
    buffer[idx + 2] = Math.max(b * scalefactor / luminanceMean, 0);
    buffer[idx + 3] = a;
  });

  applyGammaCorrection(buffer, gamma);
  return buffer;
};

export const applyLinearScalefactor = (buffer: Float32Array, hitmap: Uint32Array, width: number, height: number, gamma = 0.45) => {
  // find the maximum number of hits
  const max = hitmap.reduce((result, current) => Math.max(result, current), Number.MIN_SAFE_INTEGER);

  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    const factor = hitmap[i + j * width] / max;
    buffer[idx + 0] = r * factor;
    buffer[idx + 1] = g * factor;
    buffer[idx + 2] = b * factor;
    buffer[idx + 3] = a;
  });

  applyGammaCorrection(buffer, gamma);
  return buffer;
};

export const applyLogScalefactor = (buffer: Float32Array, hitmap: Uint32Array, width: number, height: number, gamma = 0.45) => {
  // find the maximum number of hits
  const max = hitmap.reduce((result, current) => Math.max(result, Math.log10(current)), Number.MIN_SAFE_INTEGER);

  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    const factor = Math.log(hitmap[i + j * width]) / max;
    buffer[idx + 0] = r * factor;
    buffer[idx + 1] = g * factor;
    buffer[idx + 2] = b * factor;
    buffer[idx + 3] = a;
  });

  applyGammaCorrection(buffer, gamma);
  return buffer;
};

export const applyGammaCorrection = (buffer: Float32Array, gamma = 0.45) => {
  if (gamma === 1) {
    return;
  }
  for (let i = 0; i < buffer.length; i++) {
    if ((i + 1) % 4 !== 0) {
      buffer[i] = Math.pow(buffer[i], gamma);
    }
  }
};

export const hslAdd = (buffer: Float32Array, width: number, height: number, deltaHue = 0, deltaSat = 0, deltaLum = 0) => {
  forEachPixel(buffer, width, height, (r, g, b, a, x, y, idx) => {
    const hsl = D3Color.hsl(D3Color.rgb(r, g, b));
    hsl.h = (hsl.h + Math.floor(deltaHue * 360)) % 360;
    hsl.s = clamp(hsl.s + deltaSat, 0, 1);
    hsl.l = clamp(hsl.l + deltaLum, 0, 1);
    const rgb = D3Color.rgb(hsl);
    buffer[idx + 0] = rgb.r;
    buffer[idx + 1] = rgb.g;
    buffer[idx + 2] = rgb.b;
    buffer[idx + 3] = a;
  });
  return buffer;
};

export const hslMultiply = (buffer: Float32Array, width: number, height: number, factorHue = 1, factorSat = 1, factorLum = 1) => {
  forEachPixel(buffer, width, height, (r, g, b, a, x, y, idx) => {
    const hsl = D3Color.hsl(D3Color.rgb(r, g, b));
    hsl.h = (hsl.h * factorHue) % 360;
    hsl.s = clamp(hsl.s * factorSat, 0, 1);
    hsl.l = clamp(hsl.l * factorLum, 0, 1);
    const rgb = D3Color.rgb(hsl);
    buffer[idx + 0] = rgb.r;
    buffer[idx + 1] = rgb.g;
    buffer[idx + 2] = rgb.b;
    buffer[idx + 3] = a;
  });
  return buffer;
};

// https://en.wikipedia.org/wiki/Relative_luminance ITU BT.709
export const getLuminance = (r: number, g: number, b: number) => {
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
};

// http://www.itu.int/rec/R-REC-BT.601 ITU BT.601
export const getLuminance2 = (r: number, g: number, b: number) => {
  return r * 0.299 + g * 0.587 + b * 0.114;
};

export const getLuminance3 = (r: number, g: number, b: number) => {
  return Math.sqrt(r * r * 0.299 + g * g * 0.587 + b * b * 0.114);
};

export const getIntensity = (r: number, g: number, b: number) => {
  return (r + g + b) / 3;
};

export const getBrightness = (r: number, g: number, b: number) => {
  return Math.max(r, g, b);
};

export const getLightness = (r: number, g: number, b: number) => {
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
};

export const convertUnitToRGBA = (buffer: Float32Array) => {
  const newBuffer = new Uint8Array(buffer.length);
  buffer.forEach((x: number, i: number) => {
    newBuffer[i] = clampInt(x * 255, 0, 255);
  });
  return newBuffer;
};

export const convertRGBAToUnit = (buffer: Float32Array) => {
  const newBuffer = new Float32Array(buffer.length);
  buffer.forEach((x: number, i: number) => {
    newBuffer[i] = x / 255;
  });
  return newBuffer;
};

export const buildColorMap = (colors: Color[], steps = 1024): ColorMap => {
  const rgbColors = colors.map(color => D3Color.rgb(...denormalizeColor(color)));
  const f = D3Interpolate.interpolateRgbBasis(rgbColors);
  const colormap = D3Interpolate.quantize(f, steps);
  return colormap.map(color => {
    const rgb = D3Color.rgb(color);
    return normalizeColor([ rgb.r, rgb.g, rgb.b, 255 ]);
  });
};

const interpolatePositions = (x: number, positions: number[]): number => {
  if (positions.length <= 1 ) {
    return x;
  }
  for (let i = 1; i < positions.length; i++) {
    const val1 = positions[i - 1];
    const val2 = positions[i];
    if (x >= val1 && x <= val2) {
      const start = (i - 1) / (positions.length - 1);
      const valRange = val2 - val1;
      const percentRange = 1 / (positions.length - 1);
      return start + percentRange * (x - val1) / valRange;
    }
  }
  throw new Error('Cannot interpolate');
};

export const buildConstrainedColorMap = (colors: Color[], posFunction?: RealToRealFunction | number[], steps = 1024): ColorMap => {
  const rgbColors = colors.map(color => D3Color.rgb(...denormalizeColor(color)));

  let f1 = posFunction;
  if (posFunction == null) {
    f1 = x => x;
  } else if (Array.isArray(posFunction)) {
    const positions = posFunction;
    f1 = (x) => interpolatePositions(x, positions);
  }
  const f2 = D3Interpolate.interpolateRgbBasis(rgbColors);
  const colormap = D3Interpolate.quantize(x => f2(f1(x)), steps);
  return colormap.map(color => {
    const rgb = D3Color.rgb(color);
    return normalizeColor([ rgb.r, rgb.g, rgb.b, 255 ]);
  });
};

export const pickColorMapValue = (x: number, map: ColorMap): Color => {
  const i = Math.trunc(clamp(x, 0, 1) * (map.length - 1));
  return map[i];
};

export const makeColorMapFunction = (map: ColorMap): ColorMapFunction => {
  return x => pickColorMapValue(x, map);
};

export const buildSteppedColorMap = (colors: Color[], positions?: number[], steps = 1024): ColorMap => {
  if (positions == null) {
    positions = colors.map((_, i) => (i + 1) / colors.length);
  }

  let current = 0;
  return new Array(steps).fill(0).map((_, i) => {
    if (current < (colors.length - 1) && i / steps >= positions[current]) {
      current++;
    }
    return colors[current];
  });
};

export const normalizeColor = (color: Color): Color => {
  return <Color> color.map(x => x / 255);
};
export const denormalizeColor = (color: Color): Color => {
  return <Color> color.map(x => Math.trunc(x * 255));
};

export const normalizeColorMap = (colormap: ColorMap): ColorMap => {
  return colormap.map(color => normalizeColor(color));
};

export const mixColorLinear = (color1: Color, color2: Color, amount = 0.5): Color => {
  const reverseAmount = 1 - amount;
  return [
    (color1[0] * amount) + (color2[0] * reverseAmount),
    (color1[1] * amount) + (color2[1] * reverseAmount),
    (color1[2] * amount) + (color2[2] * reverseAmount),
    1, // TODO mix alpha?
  ];
};

export const invertColor = (color1: Color): Color => {
  return [
    1 - color1[0],
    1 - color1[1],
    1 - color1[2],
    color1[3],
  ];
};

// https://en.wikipedia.org/wiki/Color_difference
export const getRedmeanColorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
  const r = 255 * (r1 + r2) / 2;
  const dr = 255 * (r1 - r2);
  const dg = 255 * (g1 - g2);
  const db = 255 * (b1 - b2);

  const dc2 = (2 + r / 256) * dr * dr + 4 * dg * dg + (2 + (255 - r) / 256) * db * db;
  return Math.sqrt(dc2);
}

export const hslToRgb = (h: number, s: number, l: number, a = 1) => {
  const rgb = D3Color.rgb(D3Color.hsl(h, s, l));
  return normalizeColor([ rgb.r, rgb.g, rgb.b, a * 255 ]);
}

export const rgbToHsl = (r: number, g: number, b: number, a = 1) => {
  const hsl = D3Color.hsl(D3Color.rgb(r * 255, g * 255, b * 255));
  return [ hsl.h, hsl.s, hsl.l, a ];
}

export const hexColor = (r: number, g: number, b: number, a = 1) => {
  return D3Color.rgb(r * 255, g * 255, b * 255, a).formatHex();
}

export const BLACK: Color = [ 0, 0, 0, 1 ];
export const WHITE: Color = [ 1, 1, 1, 1 ];

/** Common maps */
export const RainbowColormap = buildColorMap([ [ 1, 0, 0, 1 ], [ 0, 1, 0, 1 ], [ 0, 0, 1, 1 ] ]);
