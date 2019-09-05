/*
LINKS
https://community.wolfram.com/groups/-/m/t/1025180
*/

import { add, complex, mul, reciprocal } from '../utils/complex';
import { circularDistance } from '../utils/distance';
import { BI_UNIT_DOMAIN, zoomDomain } from '../utils/domain';
import { mkdirs } from '../utils/fs';
import { findAllSubsets, toParamsChainString } from '../utils/misc';
import { makePolygon, withinPolygon } from '../utils/polygon';
import { pickRandom, randomComplex, randomInteger } from '../utils/random';
import { moveTowards } from '../utils/segment';
import { plotPolygon, plotWalk } from './util';


const OUTPUT_DIRECTORY = `${__dirname}/../output/chaos-game`;
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
    zn = moveTowards(zn, vertex, jumpLength);
    return zn;
  };
};

plotWalk(`${OUTPUT_DIRECTORY}/walk-triangle.png`, 1024, 1024, makePolygonRandomWalk(makePolygon(3)), BI_UNIT_DOMAIN, 100000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-triangle-jump=0.4.png`, 1024, 1024, makePolygonRandomWalk(makePolygon(3), 0.4), BI_UNIT_DOMAIN, 100000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-square.png`, 1024, 1024, makePolygonRandomWalk(makePolygon(4)), BI_UNIT_DOMAIN, 100000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-square-jump=0.4.png`, 1024, 1024, makePolygonRandomWalk(makePolygon(4), 0.4), BI_UNIT_DOMAIN, 100000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-pentagon.png`, 1024, 1024, makePolygonRandomWalk(makePolygon(5)), BI_UNIT_DOMAIN, 100000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-pentagon-jump=0.4.png`, 1024, 1024, makePolygonRandomWalk(makePolygon(5), 0.4), BI_UNIT_DOMAIN, 100000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-hexagon.png`, 1024, 1024, makePolygonRandomWalk(makePolygon(6)), BI_UNIT_DOMAIN, 100000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-hexagon-jump=0.4.png`, 1024, 1024, makePolygonRandomWalk(makePolygon(6), 0.4), BI_UNIT_DOMAIN, 100000);

// create a right-angled triangle
const triangle = makePolygon(3);
triangle[0].re = triangle[1].re;
plotWalk(`${OUTPUT_DIRECTORY}/walk-right-angled-triangle.png`, 1024, 1024, makePolygonRandomWalk(triangle), BI_UNIT_DOMAIN, 100000);


const makeRestrictedPolygonRandomWalk = (polygon, allowedJumps, jumpLength = 0.5) => {
  let zn = randomComplex();
  while (withinPolygon(zn, polygon) === false) {
    zn = randomComplex();
  }
  let position = randomInteger(0, polygon.length);
  return () => {
    position = (position + pickRandom(allowedJumps)) % polygon.length;
    const vertex = polygon[position];
    zn = moveTowards(zn, vertex, jumpLength);
    return zn;
  };
};

const plotRestrictedPolygonRandomWalk = async (polygon, minSubsetSize = 3) => {
  const subsets = findAllSubsets(new Array(polygon.length).fill(null).map((x, i) => i + 1));
  for (let i = 0; i < subsets.length; i++) {
    if (subsets[i].length >= minSubsetSize) {
      const params = toParamsChainString({ n: polygon.length, subset: subsets[i] });
      await plotWalk(`${OUTPUT_DIRECTORY}/walk-jump-${params}.png`, 1024, 1024, makeRestrictedPolygonRandomWalk(polygon, subsets[i]), BI_UNIT_DOMAIN, 100000);
    }
  }
};
plotRestrictedPolygonRandomWalk(makePolygon(4));
plotRestrictedPolygonRandomWalk(makePolygon(5));
plotRestrictedPolygonRandomWalk(makePolygon(6));


// if the two previous chosen positions are identical, we avoid jumping to neighbors
const customWalk = (polygon, jumpLength = 0.5) => {
  let zn = randomComplex();
  while (withinPolygon(zn, polygon) === false) {
    zn = randomComplex();
  }
  let previousPosition = -2;
  let previousPreviousPosition = -1;
  return () => {
    let position = randomInteger(0, polygon.length);
    if (previousPosition === previousPreviousPosition) {
      while (circularDistance(previousPosition, position, polygon.length) === 1) {
        position = randomInteger(0, polygon.length);
      }
    }

    const vertex = polygon[position];
    zn = moveTowards(zn, vertex, jumpLength);

    previousPreviousPosition = previousPosition;
    previousPosition = position;
    return zn;
  };
};

plotWalk(`${OUTPUT_DIRECTORY}/walk-custom-square.png`, 1024, 1024, customWalk(makePolygon(4)), BI_UNIT_DOMAIN, 10000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-custom-pentagon.png`, 1024, 1024, customWalk(makePolygon(5)), BI_UNIT_DOMAIN, 10000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-custom-hexagon.png`, 1024, 1024, customWalk(makePolygon(6)), BI_UNIT_DOMAIN, 10000000);


const customWalk2 = (polygon, jumpLength = 0.5) => {
  let zn = randomComplex();
  while (withinPolygon(zn, polygon) === false) {
    zn = randomComplex();
  }
  let previousPosition = 0;
  let previousPreviousPosition = 0;
  return () => {
    let position = randomInteger(0, polygon.length);
    while (circularDistance(previousPosition, position, polygon.length) === 1 || circularDistance(previousPreviousPosition, position, polygon.length) === 1) {
      position = randomInteger(0, polygon.length);
    }

    const vertex = polygon[position];
    zn = moveTowards(zn, vertex, jumpLength);

    previousPreviousPosition = previousPosition;
    previousPosition = position;
    return zn;
  };
};
plotWalk(`${OUTPUT_DIRECTORY}/walk-custom2-pentagon.png`, 1024, 1024, customWalk2(makePolygon(5)), BI_UNIT_DOMAIN, 1000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-custom2-hexagon.png`, 1024, 1024, customWalk2(makePolygon(6)), BI_UNIT_DOMAIN, 1000000);


// http://paulbourke.net/fractals/star
const customWalk3 = (polygon) => {
  let zn = complex(1, 1);
  return () => {
    const position = randomInteger(0, polygon.length);
    const vertex = polygon[position];

    zn = reciprocal(zn, zn);
    zn = mul(zn, 1/3, zn);
    zn = add(zn, vertex, zn);
    zn = reciprocal(zn, zn);
    return zn;
  };
};
const makeCustomPolygon = (n) => {
  const polygon = [];
  const twoPi = 2 * Math.PI;
  for (let i = 0; i < n; i++) {
    polygon.push(complex(Math.cos(twoPi * (i + 1) / n), Math.sin(twoPi * (i + 1) / n))); // regular n-gon
    polygon.push(complex(0.5 * (Math.cos(twoPi * (i + 1) / n) + Math.cos(twoPi * i / n)), 0.5 * (Math.sin(twoPi * (i + 1) / n) + Math.sin(twoPi * i / n)))); // rotated regular n-gon
  }
  return polygon;
};


plotPolygon(`${OUTPUT_DIRECTORY}/walk-custom3-n=3-polygon.png`, 1024, 1024, makeCustomPolygon(3), BI_UNIT_DOMAIN, 1000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-custom3-n=3.png`, 1024, 1024, customWalk3(makeCustomPolygon(3)), zoomDomain(BI_UNIT_DOMAIN, 0, 0, 0.3), 10000000);
plotPolygon(`${OUTPUT_DIRECTORY}/walk-custom3-n=4-polygon.png`, 1024, 1024, makeCustomPolygon(4), BI_UNIT_DOMAIN, 1000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-custom3-n=4.png`, 1024, 1024, customWalk3(makeCustomPolygon(4)), zoomDomain(BI_UNIT_DOMAIN, 0, 0, 0.3), 10000000);
plotPolygon(`${OUTPUT_DIRECTORY}/walk-custom3-n=5-polygon.png`, 1024, 1024, makeCustomPolygon(5), BI_UNIT_DOMAIN, 1000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-custom3-n=5.png`, 1024, 1024, customWalk3(makeCustomPolygon(5)), zoomDomain(BI_UNIT_DOMAIN, 0, 0, 0.3), 10000000);
