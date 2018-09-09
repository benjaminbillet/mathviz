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
  let start = palette.length;
  for (let i = start; i < nbColors; i++) {
    palette.push(palette[i % start]);
  }
  return palette;
};
