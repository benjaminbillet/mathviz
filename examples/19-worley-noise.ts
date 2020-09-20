import { makeWorleyNoise, makeWorleyLogSumNoise } from '../noise/worleyNoise';
import { euclidean2d, manhattan2d, chebyshev2d, euclidean, makeMinkowski2d, makeAkritean2d, karlsruhe2d, makeSuperellipse2d } from '../utils/distance';
import { mkdirs } from '../utils/fs';
import { DistanceFunction2D } from '../utils/types';
import { plotNoise } from './util';

const OUTPUT_DIRECTORY = `${__dirname}/../output/noise`;
mkdirs(OUTPUT_DIRECTORY);

const size = 1024;

// a simple function that recenter pixels
const makeCenteredDistance = (size: number, distanceFunc: DistanceFunction2D): DistanceFunction2D => {
  return (x1, y1, x2, y2) => {
    x1 = (x1 - size / 2);
    y1 = (y1 - size / 2);
    x2 = (x2 - size / 2);
    y2 = (y2 - size / 2);
    return distanceFunc(x1, y1, x2, y2);
  };
};

const makeNormalizedDistance = (size: number, distanceFunc: DistanceFunction2D): DistanceFunction2D => {
  return (x1, y1, x2, y2) => {
    x1 = x1 / size;
    y1 = y1 / size;
    x2 = x2 / size;
    y2 = y2 / size;
    return distanceFunc(x1, y1, x2, y2);
  };
};


// different distance function give different aspect to the worley noise
plotNoise(() => makeWorleyNoise(size, size, euclidean2d), size, `${OUTPUT_DIRECTORY}/noise-worley-euclidean.png`);
plotNoise(() => makeWorleyNoise(size, size, euclidean2d, 0.1, 6), size, `${OUTPUT_DIRECTORY}/noise-worley-euclidean-6th.png`);
plotNoise(() => makeWorleyNoise(size, size, manhattan2d), size, `${OUTPUT_DIRECTORY}/noise-worley-manhattan.png`);
plotNoise(() => makeWorleyNoise(size, size, chebyshev2d), size, `${OUTPUT_DIRECTORY}/noise-worley-chebyshev.png`);
plotNoise(() => makeWorleyNoise(size, size, makeMinkowski2d(0.5)), size, `${OUTPUT_DIRECTORY}/noise-worley-minkowski.png`);
plotNoise(() => makeWorleyNoise(size, size, makeAkritean2d(0.5)), size, `${OUTPUT_DIRECTORY}/noise-worley-akritean.png`);
plotNoise(() => makeWorleyNoise(size, size, makeCenteredDistance(size, karlsruhe2d)), size, `${OUTPUT_DIRECTORY}/noise-worley-karlsruhe.png`);


// it is easy to create custom distance functions
const customDistFunc: DistanceFunction2D = (x1, y1, x2, y2, f = 1) => euclidean2d(Math.sin(x1 * f * 2 * Math.PI), Math.sin(y1 * f * 2 * Math.PI), Math.sin(x2 * f * 2 * Math.PI), Math.sin(y2 * f * 2 * Math.PI));
plotNoise(() => makeWorleyNoise(size, size, makeNormalizedDistance(size, customDistFunc)), size, `${OUTPUT_DIRECTORY}/noise-worley-custom.png`);

const makeCustomDistFunc2 = (e: number, distFunc = euclidean2d) => {
  return makeNormalizedDistance(size, (x1, y1, x2, y2) => {
    const d = distFunc(x1, y1, x2, y2);
    return d + (1 + Math.sin(e * d * 2 * Math.PI)) / 2;
  });
};

plotNoise(() => makeWorleyNoise(size, size, makeCustomDistFunc2(1)), size, `${OUTPUT_DIRECTORY}/noise-worley-custom2-e=1.png`);
plotNoise(() => makeWorleyNoise(size, size, makeCustomDistFunc2(20)), size, `${OUTPUT_DIRECTORY}/noise-worley-custom2-e=20.png`);
plotNoise(() => makeWorleyNoise(size, size, makeCustomDistFunc2(20, manhattan2d)), size, `${OUTPUT_DIRECTORY}/noise-worley-custom2-e=20-manhattan.png`);
plotNoise(() => makeWorleyNoise(size, size, makeCustomDistFunc2(20, karlsruhe2d)), size, `${OUTPUT_DIRECTORY}/noise-worley-custom2-e=20-karlsruhe.png`);
plotNoise(() => makeWorleyNoise(size, size, makeCustomDistFunc2(20, makeAkritean2d(0.5))), size, `${OUTPUT_DIRECTORY}/noise-worley-custom2-e=20-akritean.png`);
plotNoise(() => makeWorleyNoise(size, size, makeCustomDistFunc2(20, makeSuperellipse2d(1, 1, 0.5))), size, `${OUTPUT_DIRECTORY}/noise-worley-custom2-e=20-superellipse.png`);

// log-sum worley noise
plotNoise(() => makeWorleyLogSumNoise(size, size, euclidean), size, `${OUTPUT_DIRECTORY}/noise-worleylogsum-euclidean.png`);
