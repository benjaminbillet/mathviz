import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotAttractor } from '../util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { BI_UNIT_DOMAIN, scaleDomain } from '../../utils/domain';
import { MAVERICK } from '../../utils/palette';
import { makeMixedColorSteal } from '../../ifs/fractal-flame';
import { complex } from '../../utils/complex';
import { makeGumowskiMira } from '../../attractors/gumowski-mira';
import { getPictureSize } from '../../utils/picture';
import { RenderFrameFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-attractors`;
mkdirs(OUTPUT_DIRECTORY);

const nbIterations = 1000000;

const varyMu = (a: number, x0: number, y0: number, domainScale: number): RenderFrameFunction => {
  const initialPointPicker = () => complex(x0, y0);
  const domain = scaleDomain(BI_UNIT_DOMAIN, domainScale);
  const [ width, height ] = getPictureSize(1024, domain, true);
  const colorFunc = makeMixedColorSteal(MAVERICK, domain.xmax / 2, nbIterations, 0.99, 0.01);
  return async (x, _, path) => {
    setRandomSeed(100);
    x = Math.trunc(x * 1000000) / 1000000;
    const attractor = makeGumowskiMira(a, x);
    console.log(x);
    await plotAttractor(path, width, height, attractor, initialPointPicker, colorFunc, nbIterations, domain);
  };
};

//animateFunction(varyMu(0.008, 0, 0.5, 20), -0.5, 0.5, Easing.linear, 500, OUTPUT_DIRECTORY, 'gumowski-mira1', 20);
//animateFunction(varyMu(0.7925, 0, 0.5, 10), -0.5, -0.25, Easing.linear, 500, OUTPUT_DIRECTORY, 'gumowski-mira2', 20);
//animateFunction(varyMu(0.7925, 0, 0.5, 10), 0.15, 0.32, Easing.linear, 500, OUTPUT_DIRECTORY, 'gumowski-mira3', 20);
animateFunction(varyMu(0, 0.5, -0.3275, 20), -0.5, 0.5, Easing.linear, 10000, OUTPUT_DIRECTORY, 'gumowski-mira4', 20);
