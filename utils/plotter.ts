import { mapDomainToPixel } from './picture';
import { BI_UNIT_DOMAIN } from './domain';
import { Affine2D, BiRealToRealFunction, ComplexPlotter, PixelPlotter } from './types';
import { alphaBlendingFunction } from './blend';

// TODO create a kind of generic plotter instead of a lot of specific ones? Would the impact on performance be very bad?

export const makePlotter = (buffer: Float32Array, width: number, height: number): PixelPlotter => {
  return (x, y, color) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return false;
    }
    x = Math.trunc(x);
    y = Math.trunc(y);

    const idx = (x + y * width) * 4;
    buffer[idx + 0] = color[0];
    buffer[idx + 1] = color[1];
    buffer[idx + 2] = color[2];
    buffer[idx + 3] = color[3];
    return true;
  };
};

export const makeAlphaBlendingPlotter = (buffer: Float32Array, width: number, height: number): PixelPlotter => {
  const inputColorBuffer = new Float32Array(4).fill(0);
  const outputColorBuffer = new Float32Array(4).fill(0);
  return (x, y, color) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return false;
    }
    x = Math.trunc(x);
    y = Math.trunc(y);

    const idx = (x + y * width) * 4;
   
    inputColorBuffer[0] = buffer[idx + 0];
    inputColorBuffer[1] = buffer[idx + 1];
    inputColorBuffer[2] = buffer[idx + 2];
    inputColorBuffer[3] = buffer[idx + 3];

    alphaBlendingFunction(color, inputColorBuffer, outputColorBuffer);

    buffer[idx + 0] = outputColorBuffer[0];
    buffer[idx + 1] = outputColorBuffer[1];
    buffer[idx + 2] = outputColorBuffer[2];
    buffer[idx + 3] = outputColorBuffer[3];

    return true;
  };
};


export const makeZPlotter = (buffer: Float32Array, width: number, height: number): ComplexPlotter => {
  const plotter = makePlotter(buffer, width, height);
  return (z, color) => plotter(z.re, z.im, color);
};

export const makeMappedPlotter = (buffer: Float32Array, width: number, height: number, domain = BI_UNIT_DOMAIN): PixelPlotter => {
  const plotter = makePlotter(buffer, width, height);
  return (x, y, color) => {
    const [ fx, fy ] = mapDomainToPixel(x, y, domain, width, height);
    return plotter(fx, fy, color);
  };
};

export const makeMappedZPlotter = (buffer: Float32Array, width: number, height: number, domain = BI_UNIT_DOMAIN): ComplexPlotter => {
  const plotter = makeMappedPlotter(buffer, width, height, domain);
  return (z, color) => plotter(z.re, z.im, color);
};

export const makeBlendPlotter = (buffer: Float32Array, width: number, height: number, blendFunc: BiRealToRealFunction): PixelPlotter => {
  return (x, y, color) => {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return false;
    }
    x = Math.trunc(x);
    y = Math.trunc(y);

    const idx = (x + y * width) * 4;
    buffer[idx + 0] = blendFunc(buffer[idx + 0], color[0]);
    buffer[idx + 1] = blendFunc(buffer[idx + 1], color[1]);
    buffer[idx + 2] = blendFunc(buffer[idx + 2], color[2]);
    buffer[idx + 3] = color[3];
    return true;
  };
};

export const makeMultiZPlotter = (plotter: ComplexPlotter, transforms: Affine2D[]): ComplexPlotter => {
  return (z, color) => {
    // plot regular
    let drawn = plotter(z, color);

    // transformed plot
    transforms.forEach((f) => {
      const fz = f(z);
      if (plotter(fz, color)) {
        drawn = true;
      }
    });
    return drawn;
  };
};
