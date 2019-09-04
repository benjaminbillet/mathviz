import { buildConstrainedColorMap, makeColorMapFunction } from '../../utils/color';
import { mkdirs } from '../../utils/fs';
import { JULIA_DOMAIN, makeContinousJulia } from '../../fractalsets/julia';
import { complex } from '../../utils/complex';
import { getPictureSize } from '../../utils/picture';
import { plotFunction } from '../util';
import { animateFunction } from './util';
import * as Easing from '../../utils/easing';
import { TWO_PI } from '../../utils/math';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-julia`;
mkdirs(OUTPUT_DIRECTORY);
mkdirs(`${OUTPUT_DIRECTORY}/tmp`);

const colormap = buildConstrainedColorMap(
  [ [ 0, 7, 100 ], [ 32, 107, 203 ], [ 237, 255, 255 ], [ 255, 170, 0 ], [ 0, 2, 0 ], [ 0, 7, 0 ] ],
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap, 255);

const [ width, height ] = getPictureSize(1024, JULIA_DOMAIN);

const functionToAnimate = async (v, i) => {
  const configuredJulia = makeContinousJulia(complex(-1 + 0.3 * Math.sin(v), 0.3 * Math.cos(v)), 2, 10, 50);
  await plotFunction(`${OUTPUT_DIRECTORY}/tmp/frame-${i}.png`, width, height, configuredJulia, JULIA_DOMAIN, colorfunc);
};

animateFunction(functionToAnimate, 0, TWO_PI, Easing.linear, 100, `${OUTPUT_DIRECTORY}/tmp`, `${OUTPUT_DIRECTORY}/julia.mp4`, 20);
