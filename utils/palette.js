import palette from 'google-palette';
import * as D3Color from 'd3-color';

export const getBigQualitativePalette = (nbColors) => {
  return palette('mpn65', nbColors).map((color) => {
    const rgb = D3Color.rgb(`#${color}`);
    return [ rgb.r, rgb.g, rgb.b ];
  });
};

export const getTolSequentialPalette = (nbColors) => {
  return palette('tol-sq', nbColors).map((color) => {
    const rgb = D3Color.rgb(`#${color}`);
    return [ rgb.r, rgb.g, rgb.b ];
  });
};

export const getTolDivergentPalette = (nbColors) => {
  return palette('tol-dv', nbColors).map((color) => {
    const rgb = D3Color.rgb(`#${color}`);
    return [ rgb.r, rgb.g, rgb.b ];
  });
};

export const getHueBalancedPalette = (paletteSize, baseRgb) => {
  const hsl = D3Color.hsl(D3Color.rgb(...baseRgb));
  const stepLength = 360 / paletteSize;
  return new Array(paletteSize).fill(0).map((_, i) => {
    const newHue = (hsl.h + i * stepLength) % 360;
    const rgb = D3Color.hsl(newHue, hsl.s, hsl.l).rgb();
    return [ Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b) ];
  });
};

export const getTriadicColors = (baseRgb) => {
  return getHueBalancedPalette(3, baseRgb);
};

export const getComplementaryColors = (baseRgb) => {
  return getHueBalancedPalette(2, baseRgb);
};

export const getTetradicColors = (baseRgb, stepLength = 60) => {
  const hsl = D3Color.hsl(D3Color.rgb(...baseRgb));
  const complementaryHue = hsl.h + 180;
  const colors = [
    hsl,
    D3Color.hsl((hsl.h + stepLength) % 360, hsl.s, hsl.l),
    D3Color.hsl(complementaryHue % 360, hsl.s, hsl.l),
    D3Color.hsl((complementaryHue + stepLength) % 360, hsl.s, hsl.l),
  ];
  return colors.map((color) => {
    const rgb = color.rgb();
    return [ Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b) ];
  });
};

export const getSplitComplementaryColors = (baseRgb, stepLength = 30) => {
  const hsl = D3Color.hsl(D3Color.rgb(...baseRgb));
  const complementaryHue = hsl.h + 180;
  const colors = [
    hsl,
    D3Color.hsl((complementaryHue + stepLength) % 360, hsl.s, hsl.l),
    D3Color.hsl((complementaryHue - stepLength) % 360, hsl.s, hsl.l),
  ];
  return colors.map((color) => {
    const rgb = color.rgb();
    return [ Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b) ];
  });
};

export const getAnalogousPalette = (baseRgb, paletteSize, stepLength = 30) => {
  const hsl = D3Color.hsl(D3Color.rgb(...baseRgb));
  return new Array(paletteSize).fill(0).map((_, i) => {
    let offset = Math.ceil(i / 2) * stepLength;
    if (i % 2 === 1) {
      offset = -offset;
    }
    const newHue = (hsl.h + offset) % 360;
    const rgb = D3Color.hsl(newHue, hsl.s, hsl.l).rgb();
    return [ Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b) ];
  });
};

export const getShadePalette = (baseRgb, paletteSize) => {
  const hsl = D3Color.hsl(D3Color.rgb(...baseRgb));
  return new Array(paletteSize).fill(0).map((_, i) => {
    hsl.l = 0.5 * (i+1) / paletteSize;
    const rgb = hsl.rgb();
    return [ Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b) ];
  });
};

export const getTintPalette = (baseRgb, paletteSize) => {
  const hsl = D3Color.hsl(D3Color.rgb(...baseRgb));
  return new Array(paletteSize).fill(0).map((_, i) => {
    hsl.l = 1 - 0.5 * (i+1) / paletteSize;
    const rgb = hsl.rgb();
    return [ Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b) ];
  });
};

export const getTonePalette = (baseRgb, paletteSize) => {
  const hsl = D3Color.hsl(D3Color.rgb(...baseRgb));
  return new Array(paletteSize).fill(0).map((_, i) => {
    hsl.s = (i+1) / paletteSize;
    const rgb = hsl.rgb();
    return [ Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b) ];
  });
};

export const expandPalette = (palette, nbColors) => {
  const start = palette.length;
  for (let i = start; i < nbColors; i++) {
    palette.push(palette[i % start]);
  }
  return palette;
};

export const normalizePalette = (palette, scale = 255) => {
  return palette.map(color => color.map(x => x / scale));
};

/** Common palettes */
export const FIRE = [ [ 161, 0, 0 ], [ 234, 35, 0 ], [ 255, 129, 0 ], [ 242, 85, 0 ], [ 216, 0, 0 ] ];
export const BOAT = [ [ 62, 1, 35 ], [ 180, 0, 54 ], [ 237, 227, 222 ], [ 37, 121, 133 ], [ 13, 41, 58 ] ];
export const ICE = [ [ 41, 66, 123 ], [ 0, 32, 60 ], [ 56, 126, 187 ], [ 0, 59, 111 ], [ 40, 91, 135 ] ];
export const PURPLE_MAGIC = [ [ 41, 66, 123 ], [ 0, 32, 60 ], [ 128, 0, 128 ], [ 82, 25, 140 ], [ 64, 0, 64 ], [ 140, 25, 83 ] ];
export const FOREST = [ [ 35, 77, 32 ], [ 54, 128, 45 ], [ 0, 114, 76 ], [ 190, 209, 153 ], [ 41, 83, 69 ] ];
export const MUD = [ [ 137, 81, 81 ], [ 180, 122, 90 ], [ 150, 79, 48 ], [ 103, 65, 84 ], [ 107, 50, 50 ] ];
export const WATERMELON = [ [ 133, 48, 55 ], [ 255, 61, 78 ], [ 210, 95, 108 ], [ 20, 61, 29 ], [ 56, 122, 74 ] ];
export const SEA_FIRE = [ [ 0, 59, 111 ], [ 52, 115, 143 ], [ 18, 47, 61 ], [ 190, 62, 43 ], [ 237, 138, 69 ], [ 246, 222, 108 ] ];
export const RUBY = [ [ 133, 0, 20 ], [ 174, 0, 26 ], [ 225, 5, 49 ], [ 165, 7, 39 ], [ 107, 0, 21 ], [ 116, 23, 68 ], [ 130, 7, 60 ], [ 225, 60, 83 ] ];
export const CATERPILLAR = [ [ 176, 197, 153 ], [ 226, 217, 86 ], [ 130, 166, 32 ], [ 53, 136, 28 ], [ 3, 59, 12 ] ];
export const MAVERICK = [ [ 248, 10, 0 ], [ 253, 100, 0 ], [ 236, 198, 0 ], [ 36, 75, 28 ], [ 23, 34, 67 ] ];
export const OPAL = [ [ 237, 157, 189 ], [ 182, 141, 195 ], [ 170, 221, 241 ], [ 255, 246, 128 ], [ 255, 179, 108 ], [ 206, 251, 189 ] ];
export const AUTUMN = [ [ 215, 127, 40 ], [ 229, 203, 154 ], [ 221, 169, 96 ], [ 122, 40, 40 ], [ 206, 108, 49 ], [ 199, 60, 37 ] ];
export const WOOD = [ [ 242, 209, 181 ], [ 159, 52, 52 ], [ 51, 29, 29 ], [ 141, 112, 81 ], [ 225, 180, 134 ] ];
export const BLUE_MOON = [ [ 39, 40, 144 ], [ 95, 115, 186 ], [ 209, 219, 227 ], [ 253, 250, 196 ], [ 255, 220, 109 ] ];
