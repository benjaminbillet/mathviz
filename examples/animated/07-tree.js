import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotIfsGrid } from '../util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { makeIdentity } from '../../transform';
import { getPictureSize } from '../../utils/picture';
import { makePythagoreanTree } from '../../ifs/pythagorean-tree';
import { BI_UNIT_DOMAIN } from '../../utils/domain';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-ifs`;
mkdirs(OUTPUT_DIRECTORY);

const domain = { xmin: -6, xmax: 7, ymin: -2, ymax: 6 };
const [ width, height ] = getPictureSize(1024, domain, true);
const functionToAnimate = async (angle, _, path) => {
  setRandomSeed(100);
  await plotIfsGrid(path, width, height, makePythagoreanTree(angle), 50, makeIdentity(), domain, BI_UNIT_DOMAIN, 2);
};

animateFunction(functionToAnimate, Math.PI / 8, Math.PI / 8 + Math.PI / 4, Easing.linear, 100, OUTPUT_DIRECTORY, 'pythagorean-tree', 20, 72);
