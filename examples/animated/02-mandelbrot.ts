import { buildConstrainedColorMap, makeColorMapFunction } from '../../utils/color';
import { mkdirs } from '../../utils/fs';
import { getPictureSize } from '../../utils/picture';
import { makeContinousMandelbrot, MULTIBROT_DOMAIN } from '../../fractalsets/mandelbrot';
import { animateFunction } from './util';
import { plotFunction } from '../util';
import * as Easing from '../../utils/easing';
import { RenderFrameFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-mandelbrot`;
mkdirs(OUTPUT_DIRECTORY);

const colormap = buildConstrainedColorMap(
  [ [ 0, 7, 100 ], [ 32, 107, 203 ], [ 237, 255, 255 ], [ 255, 170, 0 ], [ 0, 2, 0 ], [ 0, 7, 0 ] ],
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap, 255);

const [ width, height ] = getPictureSize(1024, MULTIBROT_DOMAIN);

const functionToAnimate: RenderFrameFunction = async (dimension, _, path) => {
  const configuredJulia = makeContinousMandelbrot(dimension, 10, 50);
  await plotFunction(path, width, height, configuredJulia, MULTIBROT_DOMAIN, colorfunc);
};

animateFunction(functionToAnimate, 2, 10, Easing.linear, 100, OUTPUT_DIRECTORY, 'multibrot', 20);
