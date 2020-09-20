import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotIfs } from '../util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { makeIteratedMandelbrotFunction } from '../../transform';
import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { compose2dFunctions } from '../../utils/misc';
import * as affine from '../../utils/affine';
import { makeFernIfs, BARNSLEY_FERN_COEFFICIENTS, BARNSLEY_FERN_PROBABILITIES } from '../../ifs/barnsley-fern';
import { RenderFrameFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-ifs`;
mkdirs(OUTPUT_DIRECTORY);

const ifs = makeFernIfs(BARNSLEY_FERN_COEFFICIENTS, BARNSLEY_FERN_PROBABILITIES);
const barnsleyToBiUnitDomain = affine.makeAffine2dFromMatrix(affine.combine(affine.homogeneousScale(1/3), affine.translate(0, -5)));
const functionToAnimate: RenderFrameFunction = async (dimension, _, path) => {
  setRandomSeed(100);
  await plotIfs(path, 1024, 1024, ifs, 10000, 10000, compose2dFunctions(barnsleyToBiUnitDomain, makeIteratedMandelbrotFunction(dimension, 5)), BI_UNIT_DOMAIN);
};

animateFunction(functionToAnimate, 4, 10, Easing.linear, 100, OUTPUT_DIRECTORY, 'fern-mandelbrot', 20);
