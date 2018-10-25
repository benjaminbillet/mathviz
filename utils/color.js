import * as D3Color from 'd3-color';
import * as D3Interpolate from 'd3-interpolate';
import { clamp, clampInt } from './misc';


const DISPLAY_LUMINANCE_MAX = 200;
const SCALEFACTOR_NUMERATOR = 1.219 + Math.pow(DISPLAY_LUMINANCE_MAX * 0.25, 0.4);
export const applyContrastBasedScalefactor = (buffer, width, height, luminanceMean = 1, gamma = 0.45) => {
  // log-average luminance, as described in 'Photographic Tone Reproduction for Digital Images'
  // http://www.cmap.polytechnique.fr/~peyre/cours/x2005signal/hdr_photographic.pdf
  let logSum = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      const luminance = getLuminance(buffer[idx], buffer[idx + 1], buffer[idx + 2]) / luminanceMean;
      logSum += Math.log(Math.max(luminance, 0.0001));
    }
  }

  const logAverage = Math.pow(10, (logSum / (width * height)));

  // scale factor, as described in 'A Contrast-Based Scalefactor for Luminance Display'
  // http://gaia.lbl.gov/btech/papers/35252.pdf
  const scalefactor = Math.pow(SCALEFACTOR_NUMERATOR / (1.219 + Math.pow(logAverage, 0.4)), 2.5) / DISPLAY_LUMINANCE_MAX;
  for (let i = 0; i < buffer.length; i++) {
    if ((i + 1) % 4 !== 0) {
      buffer[i] = Math.max(buffer[i] * scalefactor / luminanceMean, 0); // apply scalefactor
    }
  }

  applyGammaCorrection(buffer, gamma);
  return buffer;
};

export const applyGammaCorrection = (buffer, gamma = 0.45) => {
  for (let i = 0; i < buffer.length; i++) {
    if ((i + 1) % 4 !== 0) {
      buffer[i] = Math.pow(buffer[i], gamma);
    }
  }
};

export const getLuminance = (r, g, b) => {
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
};


export const convertUnitToRGBA = (buffer) => {
  let newBuffer = new Uint8Array(buffer.length);
  buffer.forEach((x, i) => {
    if ((i+1) % 4 === 0) {
      newBuffer[i] = 255;
    } else {
      newBuffer[i] = clampInt(x * 255, 0, 255);
    }
  });
  return newBuffer;
};


export const buildColorMap = (colors, steps = 1024) => {
  const rgbColors = colors.map(color => D3Color.rgb(...color));
  const f = D3Interpolate.interpolateRgbBasis(rgbColors);
  const colormap = D3Interpolate.quantize(f, steps);
  return colormap.map(color => {
    const rgb = D3Color.rgb(color);
    return [ rgb.r, rgb.g, rgb.b ];
  });
};

const interpolatePositions = (x, positions) => {
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
};

export const buildConstrainedColorMap = (colors, posFunction, steps = 1024) => {
  const rgbColors = colors.map(color => D3Color.rgb(...color));

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
    return [ rgb.r, rgb.g, rgb.b ];
  });
};

export const pickColorMapValue = (x, map) => {
  const i = Math.trunc(clamp(x, 0, 1) * (map.length - 1));
  return map[i];
};

export const makeColorMapFunction = (map, scale = 1) => {
  if (scale != 1) {
    map = normalizeColorMap(map, scale);
  }
  return x => pickColorMapValue(x, map);
};

export const buildSteppedColorMap = (colors, positions, steps = 1024) => {
  let current = 0;
  return new Array(steps).fill(0).map((_, i) => {
    if (current < (colors.length - 1) && i / steps > positions[current]) {
      current++;
    }
    return colors[current];
  });
};

export const normalizeColorMap = (colormap, scale = 255) => {
  return colormap.map(color => color.map(x => x / scale));
};


/** Common maps */
export const RainbowColormap = buildColorMap([ [ 255, 0, 0 ], [ 0, 255, 0 ], [ 0, 0, 255 ] ]);
