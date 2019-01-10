import { complex } from '../utils/complex';

import { readImage, getPictureSize, mapPixelToDomain, createImage, saveImage } from '../utils/picture';
import { mandelbar, MANDELBAR_DOMAIN, continuousMandelbar, orbitTrapMandelbar } from '../fractalsets/mandelbar';
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

const plotMandelbar = async (d, maxIterations, domain) => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbar = (z) => mandelbar(z, d, maxIterations);
  await plotFunction(`mandelbar-d=${d}.png`, width, height, configuredMandelbar, domain);
};

const plotContinuousMandelbar = async (d, maxIterations, domain) => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbar = (z) => continuousMandelbar(z, d, maxIterations);
  await plotFunction(`mandelbar-d=${d}-continuous.png`, width, height, configuredMandelbar, domain);
};

const plotBitmapTrapMandelbar = async (bitmapPath, trapSize, d, maxIterations, domain) => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbar = (z) => orbitTrapMandelbar(z, trap, d, maxIterations);
  await plotFunction(`mandelbar-d=${d}-trap.png`, width, height, configuredMandelbar, domain);
};

plotMandelbar(2, 100, MANDELBAR_DOMAIN);
plotMandelbar(4, 100, MANDELBAR_DOMAIN);

plotContinuousMandelbar(2, 100, MANDELBAR_DOMAIN);
plotContinuousMandelbar(4, 100, MANDELBAR_DOMAIN);

plotBitmapTrapMandelbar(`${__dirname}/ada.png`, 0.5, 2, 100, MANDELBAR_DOMAIN);
plotBitmapTrapMandelbar(`${__dirname}/ada.png`, 1, 4, 100, MANDELBAR_DOMAIN);
