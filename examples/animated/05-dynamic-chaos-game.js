import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotWalkClahe } from '../util';
import * as Easing from '../../utils/easing';
import { makePolygon } from '../../utils/polygon';
import { BI_UNIT_DOMAIN, scaleDomain } from '../../utils/domain';
import { pickRandom } from '../../utils/random';
import { moveTowards } from '../../utils/segment';
import { complex } from '../../utils/complex';
import { makeLowCutFilter } from '../../utils/misc';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-chaosgame`;
mkdirs(OUTPUT_DIRECTORY);

const makePolygonJumpVariantRandomWalk = (polygon, minJump, maxJump, filter = x => x, jumpStep = 0.002, varyAfter = 3000) => {
  let zn = complex(0, 0);

  let jumpLength = minJump;

  let furthest = Math.max(Math.abs(maxJump - 1), Math.abs(minJump - 1));
  let dist = Math.abs(jumpLength - 1);
  let iterationLimit = Math.trunc(varyAfter * dist / furthest);

  let i = 0;

  // the walk function consists into jumping a given distance towards one of the vertex
  // the distance varies over iterations
  return () => {
    const vertex = pickRandom(polygon);
    zn = moveTowards(zn, vertex, filter(jumpLength));

    i++;

    if (i >= iterationLimit) {
      jumpLength += jumpStep;

      if (jumpLength > maxJump) {
        jumpLength = minJump;
      }

      furthest = Math.max(Math.abs(maxJump - 1), Math.abs(minJump - 1));
      dist = Math.abs(jumpLength - 1);
      iterationLimit = varyAfter * dist / furthest;

      i = 0;
    }

    return zn;
  };
};

const domain = scaleDomain(BI_UNIT_DOMAIN, 2);
const filter = makeLowCutFilter(1, 0.62);

const makeFunc = (nbSides) => {
  return async (iterations, _, path) => {
    await plotWalkClahe(path, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(nbSides), 0.4, 1.6, filter, 0.002, 1000), domain, iterations);
  };
};

animateFunction(makeFunc(3), 100, 10000000, Easing.cubicIn, 200, OUTPUT_DIRECTORY, 'triangle-dynamic', 20);
animateFunction(makeFunc(5), 100, 10000000, Easing.cubicIn, 200, OUTPUT_DIRECTORY, 'pentagon-dynamic', 20);

