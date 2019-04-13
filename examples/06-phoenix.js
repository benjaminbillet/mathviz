import { buildConstrainedColorMap, makeColorMapFunction } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { plotFunction } from './util';
import { readImage, getPictureSize } from '../utils/picture';
import { phoenix, PHOENIX_DOMAIN, continuousPhoenix, orbitTrapPhoenix } from '../fractalsets/phoenix';
import { makeBitmapTrap } from '../fractalsets/trap';
import { complex } from '../utils/complex';
import { zoomDomain } from '../utils/domain';


const OUTPUT_DIRECTORY = `${__dirname}/../output/phoenix`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/ada.png`;


const colormap = buildConstrainedColorMap(
  [ [ 0, 7, 100 ], [ 32, 107, 203 ], [ 237, 255, 255 ], [ 255, 170, 0 ], [ 0, 2, 0 ], [ 0, 7, 0 ] ],
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);


const plotPhoenix = async (c, p, d, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredPhoenix = (z) => phoenix(z, c, p, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/phoenix-c=${c.re}+${c.im}i-p=${p.re}+${p.im}i-d=${d}${suffix}.png`, width, height, configuredPhoenix, domain, colorfunc);
};

const plotContinuousPhoenix = async (c, p, d, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredPhoenix = (z) => continuousPhoenix(z, c, p, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/phoenix-c=${c.re}+${c.im}i-d=${d}${suffix}-continuous.png`, width, height, configuredPhoenix, domain, colorfunc);
};

const plotBitmapTrapPhoenix = async (bitmapPath, trapSize, c, p, d, maxIterations, domain, suffix = '') => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(1024, domain);
  const configuredPhoenix = (z) => orbitTrapPhoenix(z, c, p, trap, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/phoenix-c=${c.re}+${c.im}i-d=${d}${suffix}-trap.png`, width, height, configuredPhoenix, domain, colorfunc);
};

plotPhoenix(complex(0.5667), complex(-0.5), 2, 100, PHOENIX_DOMAIN);
plotPhoenix(complex(0.5667), complex(-0.5), 2, 100, zoomDomain(PHOENIX_DOMAIN, 0, -0.4, 8), '-zoom');

plotContinuousPhoenix(complex(0.5667), complex(-0.5), 2, 100, PHOENIX_DOMAIN);
plotContinuousPhoenix(complex(0.5667), complex(-0.5), 2, 100, zoomDomain(PHOENIX_DOMAIN, 0, -0.4, 8), '-zoom');

plotBitmapTrapPhoenix(TRAP_IMAGE, 0.5, complex(0.5667), complex(-0.5), 2, 100, PHOENIX_DOMAIN);
