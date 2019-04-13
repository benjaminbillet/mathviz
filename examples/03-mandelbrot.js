import { buildConstrainedColorMap, makeColorMapFunction } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { plotFunction } from './util';
import { readImage, getPictureSize } from '../utils/picture';
import { mandelbrot, MANDELBROT_DOMAIN, continuousMandelbrot, orbitTrapMandelbrot, MULTIBROT_DOMAIN } from '../fractalsets/mandelbrot';
import { makeBitmapTrap } from '../fractalsets/trap';
import { zoomDomain } from '../utils/domain';


const OUTPUT_DIRECTORY = `${__dirname}/../output/mandelbrot`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/ada.png`;


const colormap = buildConstrainedColorMap(
  [ [ 0, 7, 100 ], [ 32, 107, 203 ], [ 237, 255, 255 ], [ 255, 170, 0 ], [ 0, 2, 0 ], [ 0, 7, 0 ] ],
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);


const plotMandelbrot = async (d, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbrot = (z) => mandelbrot(z, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/mandelbrot-d=${d}${suffix}.png`, width, height, configuredMandelbrot, domain, colorfunc);
};

const plotContinuousMandelbrot = async (d, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbrot = (z) => continuousMandelbrot(z, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/mandelbrot-d=${d}${suffix}-continuous.png`, width, height, configuredMandelbrot, domain, colorfunc);
};

const plotBitmapTrapMandelbrot = async (bitmapPath, trapSize, d, maxIterations, domain, suffix = '') => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(1024, domain);
  const configuredMandelbrot = (z) => orbitTrapMandelbrot(z, trap, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/mandelbrot-d=${d}${suffix}-trap.png`, width, height, configuredMandelbrot, domain, colorfunc);
};

plotMandelbrot(2, 100, MANDELBROT_DOMAIN);
plotMandelbrot(2, 100, zoomDomain(MANDELBROT_DOMAIN, -1.41, 0, 128), '-zoom');
plotMandelbrot(4, 100, MULTIBROT_DOMAIN);

plotContinuousMandelbrot(2, 100, MANDELBROT_DOMAIN);
plotContinuousMandelbrot(2, 100, zoomDomain(MANDELBROT_DOMAIN, -1.41, 0, 128), '-zoom');
plotContinuousMandelbrot(4, 100, MULTIBROT_DOMAIN);

plotBitmapTrapMandelbrot(TRAP_IMAGE, 0.5, 2, 100, MANDELBROT_DOMAIN);
plotBitmapTrapMandelbrot(TRAP_IMAGE, 1, 4, 100, MULTIBROT_DOMAIN);
