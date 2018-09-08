import Complex from 'complex.js';

import { readImage, getPictureSize } from '../utils/picture';
import { julia, JULIA_DOMAIN, continuousJulia, orbitTrapJulia } from '../fractalsets/julia';
import { makeBitmapTrap } from '../fractalsets/trap';
import { plotFunction } from './mandelbrot';

const plotJulia = async (c, d, maxIterations, domain) => {
  const [width, height] = getPictureSize(1024, domain)
  const configuredJulia = (z) => julia(z, c, d, maxIterations);
  await plotFunction(`julia-c=${c.re}+${c.im}i-d=${d}.png`, width, height, configuredJulia, domain);
}

const plotContinuousJulia = async (c,d, maxIterations, domain) => {
  const [width, height] = getPictureSize(1024, domain)
  const configuredJulia = (z) => continuousJulia(z, c, d, maxIterations);
  await plotFunction(`julia-c=${c.re}+${c.im}i-d=${d}-continuous.png`, width, height, configuredJulia, domain);
}

const plotBitmapTrapJulia = async (bitmapPath, trapSize, c,d, maxIterations, domain) => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0)

  const [width, height] = getPictureSize(1024, domain);
  const configuredJulia = (z) => orbitTrapJulia(z, c, trap, d, maxIterations);
  await plotFunction(`julia-c=${c.re}+${c.im}i-d=${d}-trap.png`, width, height, configuredJulia, domain);
}

plotJulia(new Complex(-0.761, 0.15), 2, 100, JULIA_DOMAIN);
plotJulia(new Complex(-0.584, 0.488), 3, 100, JULIA_DOMAIN);

plotContinuousJulia(new Complex(-0.761, 0.15), 2, 100, JULIA_DOMAIN);
plotContinuousJulia(new Complex(-0.584, 0.488), 3, 100, JULIA_DOMAIN);

plotBitmapTrapJulia(`${__dirname}/ada.png`, 0.5, new Complex(-0.761, 0.15), 2, 100, JULIA_DOMAIN);
plotBitmapTrapJulia(`${__dirname}/ada.png`, 1, new Complex(-0.584, 0.488), 3, 100, JULIA_DOMAIN);

