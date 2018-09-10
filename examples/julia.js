import Complex from 'complex.js';

import { readImage, getPictureSize, mapPixelToDomain, createImage, saveImage } from '../utils/picture';
import { julia, JULIA_DOMAIN, continuousJulia, orbitTrapJulia } from '../fractalsets/julia';
import { makeBitmapTrap } from '../fractalsets/trap';
import { makeColorMapFunction, buildConstrainedColorMap } from '../utils/color';

const colormap = buildConstrainedColorMap(
  [[0, 7, 100], [32, 107, 203], [237, 255, 255], [255, 170, 0], [0, 2, 0], [0, 7, 0]],
  [0, 0.16, 0.42, 0.6425, 0.8575, 1],
);
const colorfunc = makeColorMapFunction(colormap);

export const plotFunction = async (path, width, height, f, domain) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const [x, y] = mapPixelToDomain(i, j, width, height, domain);

      let color = f(new Complex(x, y));
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

const plotJulia = async (c, d, maxIterations, domain) => {
  const [width, height] = getPictureSize(1024, domain);
  const configuredJulia = (z) => julia(z, c, d, maxIterations);
  await plotFunction(`julia-c=${c.re}+${c.im}i-d=${d}.png`, width, height, configuredJulia, domain);
};

const plotContinuousJulia = async (c, d, maxIterations, domain) => {
  const [width, height] = getPictureSize(1024, domain);
  const configuredJulia = (z) => continuousJulia(z, c, d, maxIterations);
  await plotFunction(`julia-c=${c.re}+${c.im}i-d=${d}-continuous.png`, width, height, configuredJulia, domain);
};

const plotBitmapTrapJulia = async (bitmapPath, trapSize, c, d, maxIterations, domain) => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [width, height] = getPictureSize(1024, domain);
  const configuredJulia = (z) => orbitTrapJulia(z, c, trap, d, maxIterations);
  await plotFunction(`julia-c=${c.re}+${c.im}i-d=${d}-trap.png`, width, height, configuredJulia, domain);
};

plotJulia(new Complex(-0.761, 0.15), 2, 100, JULIA_DOMAIN);
plotJulia(new Complex(-0.584, 0.488), 3, 100, JULIA_DOMAIN);

plotContinuousJulia(new Complex(-0.761, 0.15), 2, 100, JULIA_DOMAIN);
plotContinuousJulia(new Complex(-0.584, 0.488), 3, 100, JULIA_DOMAIN);

plotBitmapTrapJulia(`${__dirname}/ada.png`, 0.5, new Complex(-0.761, 0.15), 2, 100, JULIA_DOMAIN);
plotBitmapTrapJulia(`${__dirname}/ada.png`, 1, new Complex(-0.584, 0.488), 3, 100, JULIA_DOMAIN);

