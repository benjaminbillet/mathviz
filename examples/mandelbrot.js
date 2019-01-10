import { complex } from '../utils/complex';

import { readImage, getPictureSize, mapPixelToDomain, createImage, saveImage } from '../utils/picture';
import { mandelbrot, MANDELBROT_DOMAIN, continuousMandelbrot, orbitTrapMandelbrot, MULTIBROT_DOMAIN } from '../fractalsets/mandelbrot';
import { makeBitmapTrap } from '../fractalsets/trap';
import { makeColorMapFunction, buildConstrainedColorMap } from '../utils/color';

const colormap = buildConstrainedColorMap(
  [ [ 0, 7, 100 ], [ 32, 107, 203 ], [ 237, 255, 255 ], [ 255, 170, 0 ], [ 0, 2, 0 ], [ 0, 7, 0 ] ],
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);

export const plotFunction = async (path, width, height, f, domain) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const [ x, y ] = mapPixelToDomain(i, j, width, height, domain);

      let color = f(complex(x, y));
      if (color.length == null) {
        color = colorfunc(color);
      }

      const idx = (i + j * width) * 4;
      buffer[idx + 0] = color[0];
      buffer[idx + 1] = color[1];
      buffer[idx + 2] = color[2];
      buffer[idx + 3] = 255;
    }
  }

  await saveImage(image, path);
};

const plotMandelbrot = async (d, maxIterations, domain) => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbrot = (z) => mandelbrot(z, d, maxIterations);
  await plotFunction(`mandelbrot-d=${d}.png`, width, height, configuredMandelbrot, domain);
};

const plotContinuousMandelbrot = async (d, maxIterations, domain) => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbrot = (z) => continuousMandelbrot(z, d, maxIterations);
  await plotFunction(`mandelbrot-d=${d}-continuous.png`, width, height, configuredMandelbrot, domain);
};

const plotBitmapTrapMandelbrot = async (bitmapPath, trapSize, d, maxIterations, domain) => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbrot = (z) => orbitTrapMandelbrot(z, trap, d, maxIterations);
  await plotFunction(`mandelbrot-d=${d}-trap.png`, width, height, configuredMandelbrot, domain);
};

plotMandelbrot(2, 100, MANDELBROT_DOMAIN);
plotMandelbrot(4, 100, MULTIBROT_DOMAIN);

plotContinuousMandelbrot(2, 100, MANDELBROT_DOMAIN);
plotContinuousMandelbrot(4, 100, MULTIBROT_DOMAIN);

plotBitmapTrapMandelbrot(`${__dirname}/ada.png`, 0.5, 2, 100, MANDELBROT_DOMAIN);
plotBitmapTrapMandelbrot(`${__dirname}/ada.png`, 1, 4, 100, MULTIBROT_DOMAIN);
