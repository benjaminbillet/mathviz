import { buildConstrainedColorMap, makeColorMapFunction } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { plotFunction } from './util';
import { readImage, getPictureSize } from '../utils/picture';
import { rationalMap, RATIONALMAP_DOMAIN, continuousRationalMap, orbitTrapRationalMap } from '../fractalsets/rational-map';
import { makeBitmapTrap } from '../fractalsets/trap';
import { complex } from '../utils/complex';
import { zoomDomain } from '../utils/domain';


const OUTPUT_DIRECTORY = `${__dirname}/../output/rational-map`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/ada.png`;


const colormap = buildConstrainedColorMap(
  [ [ 0, 7, 100 ], [ 32, 107, 203 ], [ 237, 255, 255 ], [ 255, 170, 0 ], [ 0, 2, 0 ], [ 0, 7, 0 ] ],
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);


const plotRationalMap = async (c, lambda, p, q, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredRationalMap = (z) => rationalMap(z, c, lambda, p, q, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/rationalmap-c=${c.re}+${c.im}i-λ=${lambda.re}+${lambda.im}i-p=${p}-q=${q}${suffix}.png`, width, height, configuredRationalMap, domain, colorfunc);
};

const plotContinuousRationalMap = async (c, lambda, p, q, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredRationalMap = (z) => continuousRationalMap(z, c, lambda, p, q, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/rationalmap-c=${c.re}+${c.im}i-λ=${lambda.re}+${lambda.im}i-p=${p}-q=${q}${suffix}-continuous.png`, width, height, configuredRationalMap, domain, colorfunc);
};

const plotBitmapTrapRationalMap = async (bitmapPath, trapSize, c, lambda, p, q, maxIterations, domain, suffix = '') => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(1024, domain);
  const configuredRationalMap = (z) => orbitTrapRationalMap(z, c, lambda, trap, p, q, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/rationalmap-c=${c.re}+${c.im}i-λ=${lambda.re}+${lambda.im}i-p=${p}-q=${q}${suffix}-trap.png`, width, height, configuredRationalMap, domain, colorfunc);
};

plotRationalMap(complex(0), complex(0.0625), 2, -2, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.59255), 2, -1, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.35), 2, -2, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.25), 2, -3, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.01), 3, -3, 100, RATIONALMAP_DOMAIN);
plotRationalMap(complex(0), complex(0.0352), 3, -5, 100, zoomDomain(RATIONALMAP_DOMAIN, 0.65, 0.27, 64), '-zoom');

plotContinuousRationalMap(complex(0), complex(0.0625), 2, -2, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.59255), 2, -1, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.35), 2, -2, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.25), 2, -3, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.01), 3, -3, 100, RATIONALMAP_DOMAIN);
plotContinuousRationalMap(complex(0), complex(0.0352), 3, -5, 100, zoomDomain(RATIONALMAP_DOMAIN, 0.65, 0.27, 64), '-zoom');

plotBitmapTrapRationalMap(TRAP_IMAGE, 0.25, complex(0), complex(0.0625), 2, -2, 100, RATIONALMAP_DOMAIN);
plotBitmapTrapRationalMap(TRAP_IMAGE, 1, complex(0), complex(0.59255), 2, -1, 100, RATIONALMAP_DOMAIN);
plotBitmapTrapRationalMap(TRAP_IMAGE, 1, complex(0), complex(0.35), 2, -2, 100, RATIONALMAP_DOMAIN);
plotBitmapTrapRationalMap(TRAP_IMAGE, 0.75, complex(0), complex(0.0352), 3, -5, 100, RATIONALMAP_DOMAIN);
