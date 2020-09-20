import { complex, modulus, sub } from '../utils/complex';
import { mapDomainToPixel } from '../utils/picture';
import { Color, ComplexToColorFunction, OrbitTrap, PlotBuffer } from '../utils/types';

export const makeBitmapTrap = (bitmap: PlotBuffer, bitmapWidth: number, bitmapHeight: number, trapWidth: number, trapHeight: number, x: number, y: number): OrbitTrap => {
  const xmin = x - trapWidth / 2;
  const xmax = x + trapWidth / 2;
  const ymin = y - trapHeight / 2;
  const ymax = y + trapHeight / 2;

  const domain = { xmin, xmax, ymin, ymax };
  const interpolateTrap: ComplexToColorFunction = (z) => {
    const [ bx, by ] = mapDomainToPixel(z.re, z.im, domain, bitmapWidth, bitmapHeight);
    const idx = (bx + by * bitmapWidth) * 4;
    return <Color> bitmap.slice(idx, idx + 3);
  };

  return {
    isTrapped: (z) => (z.re >= xmin && z.re <= xmax && z.im >= ymin && z.im <= ymax),
    interpolateTrap,
    untrappedValue: [ 0, 0, 0 ],
  };
};

export const makeCircularBitmapTrap = (bitmap: PlotBuffer, bitmapWidth: number, bitmapHeight: number, trapRadius: number, x: number, y: number): OrbitTrap => {
  const center = complex(x, y);

  const xmin = x - trapRadius;
  const xmax = x + trapRadius;
  const ymin = y - trapRadius;
  const ymax = y + trapRadius;
  const domain = { xmin, xmax, ymin, ymax };
  const interpolateTrap: ComplexToColorFunction = (z) => {
    const [ bx, by ] = mapDomainToPixel(z.re, z.im, domain, bitmapWidth, bitmapHeight);
    const idx = (bx + by * bitmapWidth) * 4;
    return <Color> bitmap.slice(idx, idx + 3);
  };

  return {
    isTrapped: (z) => (modulus(sub(z, center)) <= trapRadius),
    interpolateTrap,
    untrappedValue: [ 0, 0, 0 ],
  };
};

export const makeCircularTrap = (trapRadius: number, x: number, y: number): OrbitTrap => {
  const center = complex(x, y);
  return {
    isTrapped: (z) => (modulus(sub(z, center)) <= trapRadius),
    interpolateTrap: (z) => modulus(sub(z, center)) / trapRadius,
    untrappedValue: 1,
  };
};
