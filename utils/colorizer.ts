import { getShadePalette, getTintPalette, getTonePalette } from './palette';
import { randomInteger } from './random';
import { buildColorMap } from './color';
import { Color, IterableColorFunction, Palette } from './types';

export const makeShadeColorizer = (color: Color) => {
  let palette: Palette = [];
  palette = palette.concat(
    getShadePalette(color, 50).reverse(),
    getShadePalette(color, 50),
  );

  return makeRandomJumpColorFunction(palette, -10, 10);
};

export const makeTintColorizer = (color: Color) => {
  let palette: Palette = [];
  palette = palette.concat(
    getTintPalette(color, 50).reverse(),
    getTintPalette(color, 50),
  );

  return makeRandomJumpColorFunction(palette, -10, 10);
};

export const makeToneColorizer = (color: Color) => {
  let palette: Palette = [];
  palette = palette.concat(
    getTonePalette(color, 50).reverse(),
    getTonePalette(color, 50),
  );

  return makeRandomJumpColorFunction(palette, -10, 10);
};

export const makeShadeTintColorizer = (color: Color) => {
  let palette: Palette = [];
  palette = palette.concat(
    getShadePalette(color, 50),
    getTintPalette(color, 50).reverse(),
    getTintPalette(color, 50),
    getShadePalette(color, 50).reverse(),
  );

  return makeRandomJumpColorFunction(palette, -10, 10);
};

export const makeColormapColorizer = (palette: Palette, steps = 100) => {
  const colormap = buildColorMap([ ...palette, palette[0] ], steps);
  const jump = steps / 10; //Math.max(1, Math.round(Math.sqrt(steps)));
  return makeRandomJumpColorFunction(colormap, -jump, jump);
};

const makeRandomJumpColorFunction = (colors: Color[], minJump = -1, maxJump = 1): IterableColorFunction => {
  let iterations = randomInteger(0, colors.length);
  return () => {
    const c = colors[iterations];
    iterations += randomInteger(minJump, maxJump);
    if (iterations >= colors.length) {
      iterations = iterations % colors.length;
    } else if (iterations < 0) {
      iterations += colors.length;
    }
    return [ c[0] / 255, c[1] / 255, c[2] / 255 ];
  };
};
