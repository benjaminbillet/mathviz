import { buildConstrainedColorMap, makeColorMapFunction } from '../../utils/color';
import { mkdirs } from '../../utils/fs';
import { plotFunction } from '../util';
import { readImage, getPictureSize } from '../../utils/picture';
import { RATIONALMAP_DOMAIN, makeRationalMap, makeContinuousRationalMap, makeOrbitTrapRationalMap, makeStripeAverageRationalMapLinear } from '../../fractalsets/rational-map';
import { makeBitmapTrap } from '../../fractalsets/trap';
import { complex, ComplexNumber } from '../../utils/complex';
import { zoomDomain } from '../../utils/domain';
import { MANDELBROT } from '../../utils/palette';
import { PlotDomain } from '../../utils/types';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/rational-map`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/ada-big.png`;


const colormap = buildConstrainedColorMap(
  MANDELBROT,
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);

const size = 2048;


const plotRationalMap = (c: ComplexNumber, lambda: ComplexNumber, p: number, q: number, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredRationalMap = makeRationalMap(c, lambda, p, q, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/rationalmap-c=${c.re}+${c.im}i-λ=${lambda.re}+${lambda.im}i-p=${p}-q=${q}${suffix}.png`, width, height, configuredRationalMap, domain, colorfunc);
};

const plotContinuousRationalMap = (c: ComplexNumber, lambda: ComplexNumber, p: number, q: number, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredRationalMap = makeContinuousRationalMap(c, lambda, p, q, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/rationalmap-c=${c.re}+${c.im}i-λ=${lambda.re}+${lambda.im}i-p=${p}-q=${q}${suffix}-continuous.png`, width, height, configuredRationalMap, domain, colorfunc);
};

const plotAverageStripeRationalMap = (c: ComplexNumber, lambda: ComplexNumber, p: number, q: number, bailout: number, maxIterations: number, stripeDensity: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredRationalMap = makeStripeAverageRationalMapLinear(c, lambda, p, q, bailout, maxIterations, stripeDensity);
  plotFunction(`${OUTPUT_DIRECTORY}/rationalmap-c=${c.re}+${c.im}i-λ=${lambda.re}+${lambda.im}i-p=${p}-q=${q}${suffix}-stripe.png`, width, height, configuredRationalMap, domain, colorfunc);
};

const plotBitmapTrapRationalMap = (bitmapPath: string, trapSize: number, c: ComplexNumber, lambda: ComplexNumber, p: number, q: number, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const bitmap = readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.buffer, bitmap.width, bitmap.height, trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(size, domain);
  const configuredRationalMap = makeOrbitTrapRationalMap(c, lambda, trap, p, q, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/rationalmap-c=${c.re}+${c.im}i-λ=${lambda.re}+${lambda.im}i-p=${p}-q=${q}${suffix}-trap.png`, width, height, configuredRationalMap, domain);
};

plotRationalMap(complex(0), complex(0.0625), 2, -2, 2, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.59255), 2, -1, 2, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.35), 2, -2, 2, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.25), 2, -3, 2, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.01), 3, -3, 2, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.0352), 3, -5, 2, 100, zoomDomain(RATIONALMAP_DOMAIN, 0.65, 0.27, 64), '-zoom');

plotContinuousRationalMap(complex(0), complex(0.0625), 2, -2, 10, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.59255), 2, -1, 10, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.35), 2, -2, 10, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.25), 2, -3, 10, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.01), 3, -3, 10, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.0352), 3, -5, 10, 100, zoomDomain(RATIONALMAP_DOMAIN, 0.65, 0.27, 64), '-zoom');

plotAverageStripeRationalMap(complex(0), complex(0.0625), 2, -2, 100, 100, 10, RATIONALMAP_DOMAIN);
plotAverageStripeRationalMap(complex(0), complex(0.59255), 2, -1, 100, 100, 10, RATIONALMAP_DOMAIN);
plotAverageStripeRationalMap(complex(0), complex(0.35), 2, -2, 100, 100, 10, RATIONALMAP_DOMAIN);
plotAverageStripeRationalMap(complex(0), complex(0.25), 2, -3, 100, 100, 10, RATIONALMAP_DOMAIN);
plotAverageStripeRationalMap(complex(0), complex(0.01), 3, -3, 100, 100, 10, RATIONALMAP_DOMAIN);
plotAverageStripeRationalMap(complex(0), complex(0.01), 3, -3, 100, 100, 10, zoomDomain(RATIONALMAP_DOMAIN, 0, -0.265625, 10), '-zoom');
plotAverageStripeRationalMap(complex(0), complex(0.0352), 3, -5, 100, 100, 10, zoomDomain(RATIONALMAP_DOMAIN, 0.65, 0.27, 64), '-zoom');

plotBitmapTrapRationalMap(TRAP_IMAGE, 0.25, complex(0), complex(0.0625), 2, -2, 2, 100, RATIONALMAP_DOMAIN);
plotBitmapTrapRationalMap(TRAP_IMAGE, 1, complex(0), complex(0.59255), 2, -1, 2, 100, RATIONALMAP_DOMAIN);
plotBitmapTrapRationalMap(TRAP_IMAGE, 1, complex(0), complex(0.35), 2, -2, 2, 100, RATIONALMAP_DOMAIN);
plotBitmapTrapRationalMap(TRAP_IMAGE, 0.75, complex(0), complex(0.0352), 3, -5, 2, 100, RATIONALMAP_DOMAIN);
