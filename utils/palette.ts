import palette from 'google-palette';
import * as D3Color from 'd3-color';

import { Color, Palette } from './types';
import { denormalizeColor, getRedmeanColorDistance, normalizeColor } from './color';

export const getBigQualitativePalette = (nbColors: number): Palette => {
  return palette('mpn65', nbColors).map((color: Color) => {
    const rgb = D3Color.rgb(`#${color}`);
    return normalizeColor([rgb.r, rgb.g, rgb.b, 255]);
  });
};

export const getTolSequentialPalette = (nbColors: number): Palette => {
  return palette('tol-sq', nbColors).map((color: Color) => {
    const rgb = D3Color.rgb(`#${color}`);
    return normalizeColor([rgb.r, rgb.g, rgb.b, 255]);
  });
};

export const getTolDivergentPalette = (nbColors: number): Palette => {
  return palette('tol-dv', nbColors).map((color: Color) => {
    const rgb = D3Color.rgb(`#${color}`);
    return normalizeColor([rgb.r, rgb.g, rgb.b, 255]);
  });
};

export const getHueBalancedPalette = (paletteSize: number, baseRgb: Color): Palette => {
  const denormalized = denormalizeColor(baseRgb);
  const hsl = D3Color.hsl(D3Color.rgb(...denormalized));
  const stepLength = 360 / paletteSize;
  return new Array(paletteSize).fill(0).map((_, i) => {
    const newHue = (hsl.h + i * stepLength) % 360;
    const rgb = D3Color.hsl(newHue, hsl.s, hsl.l).rgb();
    return normalizeColor([ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b), denormalized[3] ]);
  });
};

export const getTriadicColors = (baseRgb: Color): Palette => {
  return getHueBalancedPalette(3, baseRgb);
};

export const getComplementaryColors = (baseRgb: Color): Palette => {
  return getHueBalancedPalette(2, baseRgb);
};

export const getTetradicColors = (baseRgb: Color, stepLength = 60): Palette => {
  const denormalized = denormalizeColor(baseRgb);
  const hsl = D3Color.hsl(D3Color.rgb(...denormalized));
  const complementaryHue = hsl.h + 180;
  const colors = [
    hsl,
    D3Color.hsl((hsl.h + stepLength) % 360, hsl.s, hsl.l),
    D3Color.hsl(complementaryHue % 360, hsl.s, hsl.l),
    D3Color.hsl((complementaryHue + stepLength) % 360, hsl.s, hsl.l),
  ];
  return colors.map((color) => {
    const rgb = color.rgb();
    return normalizeColor([ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b), denormalized[3] ]);
  });
};

export const getSplitComplementaryColors = (baseRgb: Color, stepLength = 30): Palette => {
  const denormalized = denormalizeColor(baseRgb);
  const hsl = D3Color.hsl(D3Color.rgb(...denormalized));
  const complementaryHue = hsl.h + 180;
  const colors = [
    hsl,
    D3Color.hsl((complementaryHue + stepLength) % 360, hsl.s, hsl.l),
    D3Color.hsl((complementaryHue - stepLength) % 360, hsl.s, hsl.l),
  ];
  return colors.map((color) => {
    const rgb = color.rgb();
    return normalizeColor([ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b), denormalized[3] ]);
  });
};

export const getAnalogousPalette = (baseRgb: Color, paletteSize: number, stepLength = 30): Palette => {
  const denormalized = denormalizeColor(baseRgb);
  const hsl = D3Color.hsl(D3Color.rgb(...denormalized));
  return new Array(paletteSize).fill(0).map((_, i) => {
    let offset = Math.ceil(i / 2) * stepLength;
    if (i % 2 === 1) {
      offset = -offset;
    }
    const newHue = (hsl.h + offset) % 360;
    const rgb = D3Color.hsl(newHue, hsl.s, hsl.l).rgb();
    return normalizeColor([ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b), denormalized[3] ]);
  });
};

export const getShadePalette = (baseRgb: Color, paletteSize: number): Palette => {
  const denormalized = denormalizeColor(baseRgb);
  const hsl = D3Color.hsl(D3Color.rgb(...denormalized));
  return new Array(paletteSize).fill(0).map((_, i) => {
    hsl.l = 0.5 * (i + 1) / paletteSize;
    const rgb = hsl.rgb();
    return normalizeColor([ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b), denormalized[3] ]);
  });
};

export const getTintPalette = (baseRgb: Color, paletteSize: number): Palette => {
  const denormalized = denormalizeColor(baseRgb);
  const hsl = D3Color.hsl(D3Color.rgb(...denormalized));
  return new Array(paletteSize).fill(0).map((_, i) => {
    hsl.l = 1 - 0.5 * (i + 1) / paletteSize;
    const rgb = hsl.rgb();
    return normalizeColor([ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b), denormalized[3] ]);
  });
};

export const getTonePalette = (baseRgb: Color, paletteSize: number): Palette => {
  const denormalized = denormalizeColor(baseRgb);
  const hsl = D3Color.hsl(D3Color.rgb(...denormalized));
  return new Array(paletteSize).fill(0).map((_, i) => {
    hsl.s = (i + 1) / paletteSize;
    const rgb = hsl.rgb();
    return normalizeColor([ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b), denormalized[3] ]);
  });
};

export const expandPalette = (palette: Palette, nbColors: number): Palette => {
  const start = palette.length;
  for (let i = start; i < nbColors; i++) {
    palette.push(palette[i % start]);
  }
  return palette;
};

export const normalizePalette = (palette: Palette): Palette => {
  return palette.map(color => normalizeColor(color));
};

export const getClosestColor = (palette: Palette, r: number, g: number, b: number, distance = getRedmeanColorDistance) => {
  let closest = palette[0];
  let closestDistance = distance(closest[0], closest[1], closest[2], r, g, b);
  for (let i = 1; i < palette.length; i++) {
    const d = distance(palette[i][0], palette[i][1], palette[i][2], r, g, b);
    if (d < closestDistance) {
      closest = palette[i];
      closestDistance = d;
    }
  }
  return closest;
};

/** Common palettes */
export const FIRE: Palette = [ [ 0.6, 0.0, 0.0, 1 ],[ 0.9, 0.1, 0.0, 1 ],[ 1.0, 0.5, 0.0, 1 ],[ 0.9, 0.3, 0.0, 1 ],[ 0.8, 0.0, 0.0, 1 ] ];
export const BOAT: Palette = [ [ 0.2, 0.0, 0.1, 1 ],[ 0.7, 0.0, 0.2, 1 ],[ 0.9, 0.9, 0.9, 1 ],[ 0.1, 0.5, 0.5, 1 ],[ 0.1, 0.2, 0.2, 1 ] ];
export const ICE: Palette = [ [ 0.2, 0.3, 0.5, 1 ],[ 0.0, 0.1, 0.2, 1 ],[ 0.2, 0.5, 0.7, 1 ],[ 0.0, 0.2, 0.4, 1 ],[ 0.2, 0.4, 0.5, 1 ] ];
export const PURPLE_MAGIC: Palette = [ [ 0.2, 0.3, 0.5, 1 ],[ 0.0, 0.1, 0.2, 1 ],[ 0.5, 0.0, 0.5, 1 ],[ 0.3, 0.1, 0.5, 1 ],[ 0.3, 0.0, 0.3, 1 ],[ 0.5, 0.1, 0.3, 1 ] ];
export const FOREST: Palette = [ [ 0.1, 0.3, 0.1, 1 ],[ 0.2, 0.5, 0.2, 1 ],[ 0.0, 0.4, 0.3, 1 ],[ 0.7, 0.8, 0.6, 1 ],[ 0.2, 0.3, 0.3, 1 ] ];
export const MUD: Palette = [ [ 0.5, 0.3, 0.3, 1 ],[ 0.7, 0.5, 0.4, 1 ],[ 0.6, 0.3, 0.2, 1 ],[ 0.4, 0.3, 0.3, 1 ],[ 0.4, 0.2, 0.2, 1 ] ];
export const WATERMELON: Palette = [ [ 0.5, 0.2, 0.2, 1 ],[ 1.0, 0.2, 0.3, 1 ],[ 0.8, 0.4, 0.4, 1 ],[ 0.1, 0.2, 0.1, 1 ],[ 0.2, 0.5, 0.3, 1 ] ];
export const SEA_FIRE: Palette = [ [ 0.0, 0.2, 0.4, 1 ],[ 0.2, 0.5, 0.6, 1 ],[ 0.1, 0.2, 0.2, 1 ],[ 0.7, 0.2, 0.2, 1 ],[ 0.9, 0.5, 0.3, 1 ],[ 1.0, 0.9, 0.4, 1 ] ];
export const RUBY: Palette = [ [ 0.5, 0.0, 0.1, 1 ],[ 0.7, 0.0, 0.1, 1 ],[ 0.9, 0.0, 0.2, 1 ],[ 0.6, 0.0, 0.2, 1 ],[ 0.4, 0.0, 0.1, 1 ],[ 0.5, 0.1, 0.3, 1 ],[ 0.5, 0.0, 0.2, 1 ],[ 0.9, 0.2, 0.3, 1 ] ];
export const CATERPILLAR: Palette = [ [ 0.7, 0.8, 0.6, 1 ],[ 0.9, 0.9, 0.3, 1 ],[ 0.5, 0.7, 0.1, 1 ],[ 0.2, 0.5, 0.1, 1 ],[ 0.0, 0.2, 0.0, 1 ] ];
export const MAVERICK: Palette = [ [ 1.0, 0.0, 0.0, 1 ],[ 1.0, 0.4, 0.0, 1 ],[ 0.9, 0.8, 0.0, 1 ],[ 0.1, 0.3, 0.1, 1 ],[ 0.1, 0.1, 0.3, 1 ] ];
export const OPAL: Palette = [ [ 0.9, 0.6, 0.7, 1 ],[ 0.7, 0.6, 0.8, 1 ],[ 0.7, 0.9, 0.9, 1 ],[ 1.0, 1.0, 0.5, 1 ],[ 1.0, 0.7, 0.4, 1 ],[ 0.8, 1.0, 0.7, 1 ] ];
export const AUTUMN: Palette = [ [ 0.8, 0.5, 0.2, 1 ],[ 0.9, 0.8, 0.6, 1 ],[ 0.9, 0.7, 0.4, 1 ],[ 0.5, 0.2, 0.2, 1 ],[ 0.8, 0.4, 0.2, 1 ],[ 0.8, 0.2, 0.1, 1 ] ];
export const WOOD: Palette = [ [ 0.9, 0.8, 0.7, 1 ],[ 0.6, 0.2, 0.2, 1 ],[ 0.2, 0.1, 0.1, 1 ],[ 0.6, 0.4, 0.3, 1 ],[ 0.9, 0.7, 0.5, 1 ] ];
export const BLUE_MOON: Palette = [ [ 0.2, 0.2, 0.6, 1 ],[ 0.4, 0.5, 0.7, 1 ],[ 0.8, 0.9, 0.9, 1 ],[ 1.0, 1.0, 0.8, 1 ],[ 1.0, 0.9, 0.4, 1 ] ];
export const SIERRA: Palette = [ [ 0.2, 0.1, 0.1, 1 ],[ 0.5, 0.4, 0.3, 1 ],[ 0.5, 0.3, 0.2, 1 ],[ 0.2, 0.1, 0.1, 1 ],[ 0.7, 0.4, 0.2, 1 ],[ 0.5, 0.5, 0.3, 1 ],[ 1.0, 1.0, 0.9, 1 ],[ 0.4, 0.2, 0.2, 1 ],[ 0.5, 0.2, 0.2, 1 ],[ 0.7, 0.4, 0.3, 1 ],[ 0.9, 0.7, 0.5, 1 ],[ 0.3, 0.4, 0.2, 1 ],[ 0.3, 0.3, 0.2, 1 ] ];
export const SKY: Palette = [ [ 0.8, 0.9, 0.9, 1 ],[ 0.8, 0.9, 0.9, 1 ],[ 0.8, 0.9, 0.9, 1 ],[ 0.8, 0.8, 0.9, 1 ],[ 0.6, 0.8, 0.9, 1 ],[ 0.7, 0.8, 0.9, 1 ],[ 0.7, 0.8, 0.9, 1 ],[ 0.5, 0.5, 0.6, 1 ] ];
export const MANDELBROT: Palette = [ [ 0.0, 0.0, 0.4, 1 ],[ 0.1, 0.4, 0.8, 1 ],[ 0.9, 1.0, 1.0, 1 ],[ 1.0, 0.7, 0.0, 1 ],[ 0.0, 0.0, 0.0, 1 ],[ 0.0, 0.0, 0.0, 1 ] ];