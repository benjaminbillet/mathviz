import { buildConstrainedColorMap, makeColorMapFunction } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { plotFunction } from './util';
import { readImage, getPictureSize } from '../utils/picture';
import { julia, JULIA_DOMAIN, continuousJulia, orbitTrapJulia } from '../fractalsets/julia';
import { makeBitmapTrap } from '../fractalsets/trap';
import { complex } from '../utils/complex';
import { zoomDomain } from '../utils/domain';


const OUTPUT_DIRECTORY = `${__dirname}/../output/julia`;
mkdirs(OUTPUT_DIRECTORY);

const TRAP_IMAGE = `${__dirname}/ada.png`;


const colormap = buildConstrainedColorMap(
  [ [ 0, 7, 100 ], [ 32, 107, 203 ], [ 237, 255, 255 ], [ 255, 170, 0 ], [ 0, 2, 0 ], [ 0, 7, 0 ] ],
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);


const plotJulia = async (c, d, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredJulia = (z) => julia(z, c, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/julia-c=${c.re}+${c.im}i-d=${d}${suffix}.png`, width, height, configuredJulia, domain, colorfunc);
};

const plotContinuousJulia = async (c, d, maxIterations, domain, suffix = '') => {
  const [ width, height ] = getPictureSize(1024, domain);
  const configuredJulia = (z) => continuousJulia(z, c, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/julia-c=${c.re}+${c.im}i-d=${d}${suffix}-continuous.png`, width, height, configuredJulia, domain, colorfunc);
};

const plotBitmapTrapJulia = async (bitmapPath, trapSize, c, d, maxIterations, domain, suffix = '') => {
  const bitmap = await readImage(bitmapPath);
  const trap = makeBitmapTrap(bitmap.getImage().data, bitmap.getWidth(), bitmap.getHeight(), trapSize, trapSize, 0, 0);

  const [ width, height ] = getPictureSize(1024, domain);
  const configuredJulia = (z) => orbitTrapJulia(z, c, trap, d, maxIterations);
  await plotFunction(`${OUTPUT_DIRECTORY}/julia-c=${c.re}+${c.im}i-d=${d}${suffix}-trap.png`, width, height, configuredJulia, domain, colorfunc);
};

plotJulia(complex(-0.761, 0.15), 2, 100, JULIA_DOMAIN);
plotJulia(complex(-0.761, 0.15), 2, 200, zoomDomain(JULIA_DOMAIN, -0.5, 0.25, 128), '-zoom');
plotJulia(complex(-0.584, 0.488), 3, 100, JULIA_DOMAIN);

plotContinuousJulia(complex(-0.761, 0.15), 2, 100, JULIA_DOMAIN);
plotContinuousJulia(complex(-0.761, 0.15), 2, 200, zoomDomain(JULIA_DOMAIN, -0.5, 0.25, 128), '-zoom');
plotContinuousJulia(complex(-0.584, 0.488), 3, 100, JULIA_DOMAIN);

plotBitmapTrapJulia(TRAP_IMAGE, 0.5, complex(-0.761, 0.15), 2, 100, JULIA_DOMAIN);
plotBitmapTrapJulia(TRAP_IMAGE, 1, complex(-0.584, 0.488), 3, 100, JULIA_DOMAIN);

