import { buildConstrainedColorMap, makeColorMapFunction } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { plotFunction } from './util';
import { readImage, getPictureSize } from '../utils/picture';
import { JULIA_DOMAIN, makeJulia, makeOrbitTrapJulia, makeContinousJulia, makeStripeAverageJuliaLinear } from '../fractalsets/julia';
import { makeBitmapTrap } from '../fractalsets/trap';
import { complex } from '../utils/complex';
import { zoomDomain } from '../utils/domain';
import { MANDELBROT } from '../utils/palette';


const OUTPUT_DIRECTORY = `${__dirname}/../output/julia`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/ada-big.png`;


const colormap = buildConstrainedColorMap(
  MANDELBROT,
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap, 255);

const size = 2048;


const plotJulia = async (c, d, bailout, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredJulia = makeJulia(c, d, bailout, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/julia-c=${c.re}+${c.im}i-d=${d}${suffix}.png`, width, height, configuredJulia, domain, colorfunc);
};

const plotContinuousJulia = async (c, d, bailout, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredJulia = makeContinousJulia(c, d, bailout, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/julia-c=${c.re}+${c.im}i-d=${d}${suffix}-continuous.png`, width, height, configuredJulia, domain, colorfunc);
};

const plotAverageStripeJulia = async (c, d, bailout, maxIterations, stripeDensity, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredJulia = makeStripeAverageJuliaLinear(c, d, bailout, maxIterations, stripeDensity);
  await plotFunction(`${OUTPUT_DIRECTORY}/julia-c=${c.re}+${c.im}i-d=${d}${suffix}-stripe.png`, width, height, configuredJulia, domain, colorfunc);
};

const plotBitmapTrapJulia = async (bitmapPath, trapSize, c, d, bailout, maxIterations, domain, suffix = '') => {
  const bitmap = await readImage(bitmapPath);
  const bitmapBuffer = new Float32Array(bitmap.getWidth() * bitmap.getHeight() * 4);
  bitmap.getImage().data.forEach((x, i) => bitmapBuffer[i] = x / 255);
  const trap = makeBitmapTrap(bitmapBuffer, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(size, domain);
  const configuredJulia = makeOrbitTrapJulia(c, trap, d, bailout, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/julia-c=${c.re}+${c.im}i-d=${d}${suffix}-trap.png`, width, height, configuredJulia, domain);
};

plotJulia(complex(-0.761, 0.15), 2, 2, 100, JULIA_DOMAIN);
plotJulia(complex(-0.761, 0.15), 2, 2, 200, zoomDomain(JULIA_DOMAIN, -0.5, 0.25, 128), '-zoom');
plotJulia(complex(0.355, 0.355), 2, 2, 500, JULIA_DOMAIN);
plotJulia(complex(0.355534, -0.337292), 2, 2, 1000, JULIA_DOMAIN);
plotJulia(complex(-0.584, 0.488), 3, 2, 100, JULIA_DOMAIN);

plotContinuousJulia(complex(-0.761, 0.15), 2, 10, 100, JULIA_DOMAIN);
plotContinuousJulia(complex(-0.761, 0.15), 2, 10, 200, zoomDomain(JULIA_DOMAIN, -0.5, 0.25, 128), '-zoom');
plotContinuousJulia(complex(-0.584, 0.488), 3, 10, 100, JULIA_DOMAIN);

plotAverageStripeJulia(complex(-0.761, 0.15), 2, 100, 1000, 10, JULIA_DOMAIN);
plotAverageStripeJulia(complex(-0.761, 0.15), 2, 100, 1000, 10,  zoomDomain(JULIA_DOMAIN, -0.5, 0.25, 128), '-zoom');
plotAverageStripeJulia(complex(0.355, 0.355), 2, 100, 1000, 10, zoomDomain(JULIA_DOMAIN, -0.13, 0.48, 4), '-zoom');
// note: this one is very long to compute, because a lot of points are divergent
plotAverageStripeJulia(complex(0.355534, -0.337292), 2, 100, 5000, 10, zoomDomain(JULIA_DOMAIN, 0.14, -0.46, 4), '-zoom');

plotBitmapTrapJulia(TRAP_IMAGE, 0.5, complex(-0.761, 0.15), 2, 2, 100, JULIA_DOMAIN);
plotBitmapTrapJulia(TRAP_IMAGE, 1, complex(-0.584, 0.488), 3, 2, 100, JULIA_DOMAIN);

