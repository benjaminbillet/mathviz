import { buildConstrainedColorMap, makeColorMapFunction } from '../../utils/color';
import { mkdirs } from '../../utils/fs';
import { plotFunction } from '../util';
import { getPictureSize, readImage } from '../../utils/picture';
import { MANDELBROT_DOMAIN, MULTIBROT_DOMAIN, makeStripeAverageMandelbrotLinear, makeContinousMandelbrot, makeMandelbrot, makeOrbitTrapMandelbrot } from '../../fractalsets/mandelbrot';
import { makeBitmapTrap } from '../../fractalsets/trap';
import { zoomDomain } from '../../utils/domain';
import { MANDELBROT } from '../../utils/palette';
import { PlotDomain } from '../../utils/types';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/mandelbrot`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/ada-big.png`;


const colormap = buildConstrainedColorMap(
  MANDELBROT,
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);

const size = 2048;


const plotMandelbrot = (d: number, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredMandelbrot = makeMandelbrot(d, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/mandelbrot-d=${d}${suffix}.png`, width, height, configuredMandelbrot, domain, colorfunc);
};

const plotContinuousMandelbrot = (d: number, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredMandelbrot = makeContinousMandelbrot(d, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/mandelbrot-d=${d}${suffix}-continuous.png`, width, height, configuredMandelbrot, domain, colorfunc);
};

const plotAverageStripeMandelbrot = (d: number, bailout: number, maxIterations: number, stripeDensity: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredMandelbrot = makeStripeAverageMandelbrotLinear(d, bailout, maxIterations, stripeDensity);
  plotFunction(`${OUTPUT_DIRECTORY}/mandelbrot-d=${d}${suffix}-stripe.png`, width, height, configuredMandelbrot, domain, colorfunc);
};

const plotBitmapTrapMandelbrot = (bitmapPath: string, trapSize: number, d: number, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const bitmap = readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.buffer, bitmap.width, bitmap.height, trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(size, domain);
  const configuredMandelbrot = makeOrbitTrapMandelbrot(trap, d, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/mandelbrot-d=${d}${suffix}-trap.png`, width, height, configuredMandelbrot, domain);
};

plotMandelbrot(2, 2, 100, MANDELBROT_DOMAIN);
plotMandelbrot(2, 2, 100, zoomDomain(MANDELBROT_DOMAIN, -1.41, 0, 128), '-zoom');
plotMandelbrot(4, 2, 100, MULTIBROT_DOMAIN);

plotContinuousMandelbrot(2, 10, 100, MANDELBROT_DOMAIN);
plotContinuousMandelbrot(2, 10, 100, zoomDomain(MANDELBROT_DOMAIN, -1.41, 0, 128), '-zoom');
plotContinuousMandelbrot(4, 10, 100, MULTIBROT_DOMAIN);

plotAverageStripeMandelbrot(2, 100, 1000, 10, MANDELBROT_DOMAIN);
plotAverageStripeMandelbrot(2, 100, 1000, 10, zoomDomain(MANDELBROT_DOMAIN, -0.743644, 0.131826, 1000), '-zoom');
plotAverageStripeMandelbrot(2, 100, 1000, 10, zoomDomain(MANDELBROT_DOMAIN, -0.743644, 0.131826, 300000), '-zoom2');

plotBitmapTrapMandelbrot(TRAP_IMAGE, 0.5, 2, 2, 100, MANDELBROT_DOMAIN);
plotBitmapTrapMandelbrot(TRAP_IMAGE, 1, 4, 2, 100, MULTIBROT_DOMAIN);
