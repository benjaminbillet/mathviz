import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotIfsGrid } from '../util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { makeRingsFunction } from '../../transform';
import { makeKochFlakeIfs, KOCH_FLAKE_DOMAIN } from '../../ifs/koch-curve';
import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { RenderFrameFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-ifs`;
mkdirs(OUTPUT_DIRECTORY);

const functionToAnimate: RenderFrameFunction = async (a, _, path) => {
  setRandomSeed(100);
  await plotIfsGrid(path, 1024, 1024, makeKochFlakeIfs(), 50, makeRingsFunction(a), KOCH_FLAKE_DOMAIN, BI_UNIT_DOMAIN, 0.5);
  // await plotIfs(path, 1024, 1024, makeKochFlakeIfs(), 10000, 10000, makeRingsFunction(a), KOCH_FLAKE_DOMAIN);
};

animateFunction(functionToAnimate, -1, 1, Easing.linear, 100, OUTPUT_DIRECTORY, 'koch-popcorn', 20);
