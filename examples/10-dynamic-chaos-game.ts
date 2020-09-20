import * as affine from '../utils/affine';
import { complex, ComplexNumber } from '../utils/complex';
import { BI_UNIT_DOMAIN, scaleDomain } from '../utils/domain';
import { mkdirs } from '../utils/fs';
import { makePolygon, withinPolygon } from '../utils/polygon';
import { pickRandom, random, randomComplex } from '../utils/random';
import { moveTowards } from '../utils/segment';
import { plotWalk, plotWalkClahe } from './util';
import { makeLowCutFilter } from '../utils/misc';
import { Polygon, RealToRealFunction } from '../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../output/dynamic-chaos-game`;
mkdirs(OUTPUT_DIRECTORY);


const makePolygonSlidingRandomWalk = (polygon: Polygon, slide = 0.5, freq = 1, jumpLength = 0.5) => {
  // initialize the walk with a random point within the polygon
  let zn = randomComplex();
  while (withinPolygon(zn, polygon) === false) {
    zn = randomComplex();
  }

  let i = 0;

  // the walk function consists into jumping a given distance towards one of the vertex
  return () => {
    const picked = Math.trunc(random() * polygon.length);
    let vertex = polygon[picked];

    // we transform the picked point by sliding it slightly towards the previous or the next vertex
    const amount = Math.sin(i * freq * Math.PI / 180) * slide;
    if (amount > 0) {
      vertex = moveTowards(vertex, polygon[(picked + 1) % polygon.length], amount);
    } else if (amount < 0) {
      if (picked === 0) {
        vertex = moveTowards(vertex, polygon[polygon.length - 1], amount);
      } else {
        vertex = moveTowards(vertex, polygon[picked - 1], amount);
      }
    }

    zn = moveTowards(zn, vertex, jumpLength);

    i++;
    return zn;
  };
};

plotWalk(`${OUTPUT_DIRECTORY}/walk-sliding-triangle.png`, 1024, 1024, makePolygonSlidingRandomWalk(makePolygon(3), 0.5), BI_UNIT_DOMAIN, 10000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-sliding-hexagon.png`, 1024, 1024, makePolygonSlidingRandomWalk(makePolygon(6), 0.25), BI_UNIT_DOMAIN, 10000000);

type TransformFunction = (z: ComplexNumber, osc: number) => ComplexNumber;

const makePolygonTransformingRandomWalk = (polygon: Polygon, transform: TransformFunction = z => z, freq = 1, jumpLength = 0.5) => {
  // initialize the walk with a random point within the polygon
  let zn = randomComplex();
  while (withinPolygon(zn, polygon) === false) {
    zn = randomComplex();
  }

  let i = 0;

  // the walk function consists into jumping a given distance towards one of the vertex
  // the vertices are tranformed over iterations
  return () => {
    let vertex = pickRandom(polygon);
    vertex = transform(vertex, Math.sin(i * freq * Math.PI / 180));
    zn = moveTowards(zn, vertex, jumpLength);

    i++;
    return zn;
  };
};

const makeRotate = (angle: number): TransformFunction => {
  return (z, oscillation) => affine.applyAffine2dFromMatrix(affine.rotate(oscillation * angle), z);
};
plotWalk(`${OUTPUT_DIRECTORY}/walk-rotate-triangle-30deg.png`, 1024, 1024, makePolygonTransformingRandomWalk(makePolygon(3), makeRotate(Math.PI / 6)), BI_UNIT_DOMAIN, 10000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-rotate-triangle-5deg.png`, 1024, 1024, makePolygonTransformingRandomWalk(makePolygon(3), makeRotate(Math.PI / 36)), BI_UNIT_DOMAIN, 10000000);

const makeScale = (scale: number): TransformFunction => {
  return (z, oscillation) => affine.applyAffine2dFromMatrix(affine.homogeneousScale(scale + Math.abs(oscillation * (1 - scale))), z);
};
plotWalk(`${OUTPUT_DIRECTORY}/walk-scale-triangle.png`, 1024, 1024, makePolygonTransformingRandomWalk(makePolygon(3), makeScale(0.5)), BI_UNIT_DOMAIN, 10000000);


const makePolygonJumpVariantRandomWalk = (polygon: Polygon, minJump: number, maxJump: number, filter: RealToRealFunction = x => x, jumpStep = 0.002, varyAfter = 3000) => {
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


const DOMAIN = scaleDomain(BI_UNIT_DOMAIN, 2);

plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-triangle.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(3), 0.4, 1.6), DOMAIN, 100000000);
plotWalkClahe(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-triangle-clahe.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(3), 0.4, 1.6), DOMAIN, 100000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-1-1.6-triangle.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(3), 1, 1.6), DOMAIN, 100000000);

plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.5-1.6-square.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(4), 0.5, 1.6), DOMAIN, 100000000);
plotWalkClahe(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.5-1.6-square-clahe.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(4), 0.5, 1.6), DOMAIN, 100000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-1-1.6-square.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(4), 1, 1.6), DOMAIN, 100000000);

plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.45-1.6-pentagon.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(5), 0.45, 1.6), DOMAIN, 100000000);
plotWalkClahe(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.45-1.6-pentagon-clahe.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(5), 0.45, 1.6), DOMAIN, 100000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-1-1.6-pentagon.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(5), 1, 1.6), DOMAIN, 100000000);

plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.45-1.6-hexagon.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(6), 0.45, 1.6), DOMAIN, 100000000);
plotWalkClahe(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.45-1.6-hexagon-clahe.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(6), 0.45, 1.6), DOMAIN, 100000000);
plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-1-1.6-hexagon.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(6), 1, 1.6), DOMAIN, 100000000);

plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-hendecagon.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(11), 0.4, 1.6), DOMAIN, 100000000);
plotWalkClahe(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-hendecagon-clahe.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(11), 0.4, 1.6), DOMAIN, 100000000);


const filter = makeLowCutFilter(1, 0.5);
plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-triangle-lowcut.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(3), 0.4, 1.6, filter), DOMAIN, 100000000);
plotWalkClahe(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-triangle-lowcut-clahe.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(3), 0.4, 1.6, filter), DOMAIN, 100000000);

const filter2 = makeLowCutFilter(1, 0.6);
plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-square-lowcut.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(4), 0.4, 1.6, filter2), DOMAIN, 100000000);
plotWalkClahe(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-square-lowcut-clahe.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(4), 0.4, 1.6, filter2), DOMAIN, 100000000);

const filter3 = makeLowCutFilter(1, 0.62);
plotWalk(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-pentagon-lowcut.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(5), 0.4, 1.6, filter3), DOMAIN, 10000000);
plotWalkClahe(`${OUTPUT_DIRECTORY}/walk-jumpvariant-0.4-1.6-pentagon-lowcut-clahe.png`, 1024, 1024, makePolygonJumpVariantRandomWalk(makePolygon(5), 0.4, 1.6, filter3), DOMAIN, 10000000);
