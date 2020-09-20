import { mapDomainToPixel } from './picture';
import { BI_UNIT_DOMAIN } from './domain';
import { complex } from './complex';
import { Affine2D, ComplexPlotter, PixelPlotter, PlotBuffer, PlotDomain } from './types';

export const makePixelToComplexPlotter = (plotter: ComplexPlotter): PixelPlotter => {
  const z = complex();
  return (x, y, color, ...args) => {
    z.re = x;
    z.im = y;
    return plotter(z, color, ...args);
  };
};

export const makeBufferPlotter = (buffer: PlotBuffer, width: number, height: number, domain = BI_UNIT_DOMAIN): ComplexPlotter => {
  return (z, color) => {
    const mapped = mapDomainToPixel(z.re, z.im, domain, width, height);
    const [ fx, fy ] = mapped;
    if (fx < 0 || fy < 0 || fx >= width || fy >= height) {
      return null;
    }

    const idx = (fx + fy * width) * 4;
    buffer[idx + 0] = color[0];
    buffer[idx + 1] = color[1];
    buffer[idx + 2] = color[2];

    // the alpha channel is hacked to store how many times the pixel was drawn
    buffer[idx + 3] += 1;
    return mapped;
  };
};

export const makeUnmappedBufferPlotter = (buffer: PlotBuffer, width: number, height: number): ComplexPlotter => {
  return (z, color) => {
    const idx = (z.re + z.im * width) * 4;
    buffer[idx + 0] = color[0];
    buffer[idx + 1] = color[1];
    buffer[idx + 2] = color[2];

    // the alpha channel is hacked to store how many times the pixel was drawn
    buffer[idx + 3] += 1;
    return z;
  };
};


export const makeAdditiveBufferPlotter = (buffer: PlotBuffer, width: number, height: number, domain: PlotDomain): ComplexPlotter => {
  return (z, color) => {
    const mapped = mapDomainToPixel(z.re, z.im, domain, width, height);
    const [ fx, fy ] = mapped;
    if (fx < 0 || fy < 0 || fx >= width || fy >= height) {
      return null;
    }

    const idx = (fx + fy * width) * 4;

    // the color is added to the current color; be careful, it means that you
    // will need some postprocessing in order to get the actual colors
    buffer[idx + 0] += color[0];
    buffer[idx + 1] += color[1];
    buffer[idx + 2] += color[2];

    // the alpha channel is hacked to store how many times the pixel was drawn
    buffer[idx + 3] += 1;
    return mapped;
  };
};

export const makeMultiPlotter = (plotter: ComplexPlotter, transforms: Affine2D[]): ComplexPlotter => {
  return (z, color) => {
    // plot regular
    const mapped = plotter(z, color);
    // transformed plot
    transforms.forEach((f) => {
      const fz = f(z);
      plotter(fz, color);
    });
    return mapped;
  };
};
