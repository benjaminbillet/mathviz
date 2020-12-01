import { buildConstrainedColorMap, makeColorMapFunction } from '../../utils/color';
import { mkdirs } from '../../utils/fs';
import { plotFunction } from '../util';
import { readImage, getPictureSize } from '../../utils/picture';
import { PHOENIX_DOMAIN, makePhoenix, makeContinuousPhoenix, makeOrbitTrapPhoenix, makeStripeAveragePhoenixLinear } from '../../fractalsets/phoenix';
import { makeBitmapTrap } from '../../fractalsets/trap';
import { complex, ComplexNumber } from '../../utils/complex';
import { zoomDomain } from '../../utils/domain';
import { MANDELBROT } from '../../utils/palette';
import { PlotDomain } from '../../utils/types';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/phoenix`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/../ada-big.png`;


const colormap = buildConstrainedColorMap(
  MANDELBROT,
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);

const size = 2048;


const plotPhoenix = (c: ComplexNumber, p: ComplexNumber, d: number, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredPhoenix = makePhoenix(c, p, d, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/phoenix-c=${c.re}+${c.im}i-p=${p.re}+${p.im}i-d=${d}${suffix}.png`, width, height, configuredPhoenix, domain, colorfunc);
};

const plotContinuousPhoenix = (c: ComplexNumber, p: ComplexNumber, d: number, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredPhoenix = makeContinuousPhoenix(c, p, d, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/phoenix-c=${c.re}+${c.im}i-d=${d}${suffix}-continuous.png`, width, height, configuredPhoenix, domain, colorfunc);
};

const plotAverageStripePhoenix = (c: ComplexNumber, p: ComplexNumber, d: number, bailout: number, maxIterations: number, stripeDensity: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredPhoenix = makeStripeAveragePhoenixLinear(c, p, d, bailout, maxIterations, stripeDensity);
  plotFunction(`${OUTPUT_DIRECTORY}/phoenix-c=${c.re}+${c.im}i-d=${d}${suffix}-stripe.png`, width, height, configuredPhoenix, domain, colorfunc);
};

const plotBitmapTrapPhoenix = (bitmapPath: string, trapSize: number, c: ComplexNumber, p: ComplexNumber, d: number, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const bitmap = readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.buffer, bitmap.width, bitmap.height, trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(size, domain);
  const configuredPhoenix = makeOrbitTrapPhoenix(c, p, trap, d, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/phoenix-c=${c.re}+${c.im}i-d=${d}${suffix}-trap.png`, width, height, configuredPhoenix, domain);
};

plotPhoenix(complex(0.5667), complex(-0.5), 2, 2, 100, PHOENIX_DOMAIN);
plotPhoenix(complex(0.5667), complex(-0.5), 2, 2, 100, zoomDomain(PHOENIX_DOMAIN, 0, -0.4, 8), '-zoom');

plotContinuousPhoenix(complex(0.5667), complex(-0.5), 2, 10, 100, PHOENIX_DOMAIN);
plotContinuousPhoenix(complex(0.5667), complex(-0.5), 2, 10, 100, zoomDomain(PHOENIX_DOMAIN, 0, -0.4, 8), '-zoom');

plotAverageStripePhoenix(complex(0.5667), complex(-0.5), 2, 100, 100, 10, PHOENIX_DOMAIN);
plotAverageStripePhoenix(complex(0.5667), complex(-0.5), 2, 100, 100, 10, zoomDomain(PHOENIX_DOMAIN, 0, -0.4, 8), '-zoom');

plotBitmapTrapPhoenix(TRAP_IMAGE, 0.5, complex(0.5667), complex(-0.5), 2, 2, 100, PHOENIX_DOMAIN);
