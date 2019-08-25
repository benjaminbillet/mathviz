import { buildConstrainedColorMap, makeColorMapFunction } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { plotFunction } from './util';
import { readImage, getPictureSize } from '../utils/picture';
import { MANDELBAR_DOMAIN, makeContinousMandelbar, makeMandelbar, makeOrbitTrapMandelbar } from '../fractalsets/mandelbar';
import { makeBitmapTrap } from '../fractalsets/trap';
import { MANDELBROT } from '../utils/palette';


const OUTPUT_DIRECTORY = `${__dirname}/../output/mandelbar`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/ada-big.png`;


const colormap = buildConstrainedColorMap(
  MANDELBROT,
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap, 255);

const size = 2048;


const plotMandelbar = async (d, bailout, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredMandelbar = makeMandelbar(d, bailout, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/mandelbar-d=${d}${suffix}.png`, width, height, configuredMandelbar, domain, colorfunc);
};

const plotContinuousMandelbar = async (d, bailout, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredMandelbar = makeContinousMandelbar(d, bailout, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/mandelbar-d=${d}${suffix}-continuous.png`, width, height, configuredMandelbar, domain, colorfunc);
};

const plotBitmapTrapMandelbar = async (bitmapPath, trapSize, d, bailout, maxIterations, domain, suffix = '') => {
  const bitmap = await readImage(bitmapPath);
  const bitmapBuffer = new Float32Array(bitmap.getWidth() * bitmap.getHeight() * 4);
  bitmap.getImage().data.forEach((x, i) => bitmapBuffer[i] = x / 255);
  const trap = makeBitmapTrap(bitmapBuffer, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(size, domain);
  const configuredMandelbar = makeOrbitTrapMandelbar(trap, d, bailout, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/mandelbar-d=${d}${suffix}-trap.png`, width, height, configuredMandelbar, domain);
};

plotMandelbar(2, 2, 100, MANDELBAR_DOMAIN);
plotMandelbar(4, 2, 100, MANDELBAR_DOMAIN);

plotContinuousMandelbar(2, 10, 100, MANDELBAR_DOMAIN);
plotContinuousMandelbar(4, 10, 100, MANDELBAR_DOMAIN);

plotBitmapTrapMandelbar(TRAP_IMAGE, 0.5, 2, 2, 100, MANDELBAR_DOMAIN);
plotBitmapTrapMandelbar(TRAP_IMAGE, 1, 4, 2, 100, MANDELBAR_DOMAIN);
