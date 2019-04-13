import { buildConstrainedColorMap, makeColorMapFunction } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { plotFunction } from './util';
import { readImage, getPictureSize } from '../utils/picture';
import { mandelbar, MANDELBAR_DOMAIN, continuousMandelbar, orbitTrapMandelbar } from '../fractalsets/mandelbar';
import { makeBitmapTrap } from '../fractalsets/trap';


const OUTPUT_DIRECTORY = `${__dirname}/../output/mandelbar`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/ada.png`;


const colormap = buildConstrainedColorMap(
  [ [ 0, 7, 100 ], [ 32, 107, 203 ], [ 237, 255, 255 ], [ 255, 170, 0 ], [ 0, 2, 0 ], [ 0, 7, 0 ] ],
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);


const plotMandelbar = async (d, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbar = (z) => mandelbar(z, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/mandelbar-d=${d}${suffix}.png`, width, height, configuredMandelbar, domain, colorfunc);
};

const plotContinuousMandelbar = async (d, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbar = (z) => continuousMandelbar(z, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/mandelbar-d=${d}${suffix}-continuous.png`, width, height, configuredMandelbar, domain, colorfunc);
};

const plotBitmapTrapMandelbar = async (bitmapPath, trapSize, d, maxIterations, domain, suffix = '') => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbar = (z) => orbitTrapMandelbar(z, trap, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/mandelbar-d=${d}${suffix}-trap.png`, width, height, configuredMandelbar, domain, colorfunc);
};

plotMandelbar(2, 100, MANDELBAR_DOMAIN);
plotMandelbar(4, 100, MANDELBAR_DOMAIN);

plotContinuousMandelbar(2, 100, MANDELBAR_DOMAIN);
plotContinuousMandelbar(4, 100, MANDELBAR_DOMAIN);

plotBitmapTrapMandelbar(TRAP_IMAGE, 0.5, 2, 100, MANDELBAR_DOMAIN);
plotBitmapTrapMandelbar(TRAP_IMAGE, 1, 4, 100, MANDELBAR_DOMAIN);
