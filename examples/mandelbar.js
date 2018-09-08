import { readImage, getPictureSize } from '../utils/picture';
import { mandelbar, MANDELBAR_DOMAIN, continuousMandelbar, orbitTrapMandelbar } from '../fractalsets/mandelbar';
import { makeBitmapTrap } from '../fractalsets/trap';
import { plotFunction } from './mandelbrot';


const plotMandelbar = async (d, maxIterations, domain) => {
  const [width, height] = getPictureSize(1024, domain)
  const configuredMandelbar = (z) => mandelbar(z, d, maxIterations);
  await plotFunction(`mandelbar-d=${d}.png`, width, height, configuredMandelbar, domain);
}

const plotContinuousMandelbar = async (d, maxIterations, domain) => {
  const [width, height] = getPictureSize(1024, domain)
  const configuredMandelbar = (z) => continuousMandelbar(z, d, maxIterations);
  await plotFunction(`mandelbar-d=${d}-continuous.png`, width, height, configuredMandelbar, domain);
}

const plotBitmapTrapMandelbar = async (bitmapPath, trapSize, d, maxIterations, domain) => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0)

  const [width, height] = getPictureSize(1024, domain);
  const configuredMandelbar = (z) => orbitTrapMandelbar(z, trap, d, maxIterations);
  await plotFunction(`mandelbar-d=${d}-trap.png`, width, height, configuredMandelbar, domain);
}

plotMandelbar(2, 100, MANDELBAR_DOMAIN);
plotMandelbar(4, 100, MANDELBAR_DOMAIN);

plotContinuousMandelbar(2, 100, MANDELBAR_DOMAIN);
plotContinuousMandelbar(4, 100, MANDELBAR_DOMAIN);

plotBitmapTrapMandelbar(`${__dirname}/ada.png`, 0.5, 2, 100, MANDELBAR_DOMAIN);
plotBitmapTrapMandelbar(`${__dirname}/ada.png`, 1, 4, 100, MANDELBAR_DOMAIN);