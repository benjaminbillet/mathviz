import { complex, modulus, sub } from '../utils/complex';
import { mapDomainToPixel } from '../utils/picture';

export const makeBitmapTrap = (bitmap, bitmapWidth, bitmapHeight, trapWidth, trapHeight, x, y ) => {
  const xmin = x - trapWidth / 2;
  const xmax = x + trapWidth / 2;
  const ymin = y - trapHeight / 2;
  const ymax = y + trapHeight / 2;
  const isTrapped = (z) => (z.re >= xmin && z.re <= xmax && z.im >= ymin && z.im <= ymax);

  const domain = { xmin, xmax, ymin, ymax };
  const interpolateTrap = (z) => {
    const [ bx, by ] = mapDomainToPixel(z.re, z.im, domain, bitmapWidth, bitmapHeight);
    const idx = (bx + by * bitmapWidth) * 4;
    return bitmap.slice(idx, idx + 3);
  };

  return {
    isTrapped,
    interpolateTrap,
    untrappedValue: [ 0, 0, 0 ],
  };
};

export const makeCircularBitmapTrap = (bitmap, bitmapWidth, bitmapHeight, trapRadius, x, y) => {
  const center = complex(x, y);
  const isTrapped = (z) => (modulus(sub(z, center)) <= trapRadius);

  const xmin = x - trapRadius;
  const xmax = x + trapRadius;
  const ymin = y - trapRadius;
  const ymax = y + trapRadius;
  const domain = { xmin, xmax, ymin, ymax };
  const interpolateTrap = (z) => {
    const [ bx, by ] = mapDomainToPixel(z.re, z.im, domain, bitmapWidth, bitmapHeight);
    const idx = (bx + by * bitmapWidth) * 4;
    return bitmap.slice(idx, idx + 3);
  };

  return {
    isTrapped,
    interpolateTrap,
    untrappedValue: [ 0, 0, 0 ],
  };
};

export const makeCircularTrap = (trapRadius, x, y) => {
  const center = complex(x, y);
  const isTrapped = (z) => (modulus(sub(z, center)) <= trapRadius);

  const interpolateTrap = (z) => {
    return modulus(sub(z, center)) / trapRadius;
  };

  return {
    isTrapped,
    interpolateTrap,
    untrappedValue: 1,
  };
};
