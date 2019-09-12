import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotWalk } from '../util';
import * as Easing from '../../utils/easing';
import { BI_UNIT_DOMAIN, zoomDomain } from '../../utils/domain';
import { randomInteger } from '../../utils/random';
import { complex, reciprocal, mul, add } from '../../utils/complex';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-chaosgame`;
mkdirs(OUTPUT_DIRECTORY);

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

const functionToAnimate = async (_, i, path) => {
  await plotWalk(path, 1024, 1024, customWalk3(makeCustomPolygon(5)), zoomDomain(BI_UNIT_DOMAIN, 0, 0, 0.3), 1000000);
};

animateFunction(functionToAnimate, 0, 1, Easing.linear, 100, OUTPUT_DIRECTORY, 'custom-walk', 20);
