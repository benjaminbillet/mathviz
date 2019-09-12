import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotWalk } from '../util';
import * as Easing from '../../utils/easing';
import { makePolygon, withinPolygon } from '../../utils/polygon';
import { BI_UNIT_DOMAIN, scaleDomain } from '../../utils/domain';
import { randomComplex, pickRandom } from '../../utils/random';
import { moveTowardsAbs } from '../../utils/segment';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-chaosgame`;
mkdirs(OUTPUT_DIRECTORY);

const makePolygonRandomWalk = (polygon, jumpLength = 0.5) => {
  // initialize the walk with a random point within the polygon
  let zn = randomComplex();
  while (withinPolygon(zn, polygon) === false) {
    zn = randomComplex();
  }
  // the walk function consists into jumping a given distance towards one of the vertex
  return () => {
    const vertex = pickRandom(polygon);
    zn = moveTowardsAbs(zn, vertex, jumpLength);
    return zn;
  };
};

const makeFunc = (nbSides) => {
  return async (jumpLength, _, path) => {
    await plotWalk(path, 1024, 1024, makePolygonRandomWalk(makePolygon(nbSides), jumpLength), scaleDomain(BI_UNIT_DOMAIN, 2), 10000000);
  };
};

animateFunction(makeFunc(3), 0.1, 1.7, Easing.linear, 300, OUTPUT_DIRECTORY, 'triangle-abswalk', 20);
animateFunction(makeFunc(6), 0.3, 2.7, Easing.linear, 300, OUTPUT_DIRECTORY, 'hexagon-abswalk', 20);

