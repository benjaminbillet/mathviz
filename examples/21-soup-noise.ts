import { mkdirs } from '../utils/fs';
import { plotNoise } from './util';
import { manhattan2d, makeAkritean2d, makeMinkowski2d, euclidean2d, chebyshev, euclidean, manhattan, karlsruhe2d } from '../utils/distance';
import { makeWorleyNoise, makeWorleyLogSumNoise } from '../noise/worleyNoise';
import { makeSoupNoise } from '../noise/soupNoise';

const OUTPUT_DIRECTORY = `${__dirname}/../output/noise`;
mkdirs(OUTPUT_DIRECTORY);

const size = 1024;

plotNoise(() => makeSoupNoise(makeWorleyNoise(size, size, euclidean2d), size, size), size, `${OUTPUT_DIRECTORY}/noise-soup-worley-euclidean.png`);
plotNoise(() => makeSoupNoise(makeWorleyNoise(size, size, manhattan2d), size, size), size, `${OUTPUT_DIRECTORY}/noise-soup-worley-manhattan.png`);
plotNoise(() => makeSoupNoise(makeWorleyNoise(size, size, makeAkritean2d(0.5)), size, size), size, `${OUTPUT_DIRECTORY}/noise-soup-worley-akritean.png`);
plotNoise(() => makeSoupNoise(makeWorleyNoise(size, size, makeMinkowski2d(0.5)), size, size), size, `${OUTPUT_DIRECTORY}/noise-soup-worley-minkowski.png`);
plotNoise(() => makeSoupNoise(makeWorleyNoise(size, size, karlsruhe2d), size, size), size, `${OUTPUT_DIRECTORY}/noise-soup-worley-karlsruhe.png`);

plotNoise(() => makeSoupNoise(makeWorleyLogSumNoise(size, size, chebyshev), size, size), size, `${OUTPUT_DIRECTORY}/noise-soup-worleylogsum-chebyshev.png`);
plotNoise(() => makeSoupNoise(makeWorleyLogSumNoise(size, size, (x, y) => Math.sin(x * 0.01 + y * 0.01)), size, size), size, `${OUTPUT_DIRECTORY}/noise-soup-worleylogsum-custom1.png`);
plotNoise(() => makeSoupNoise(makeWorleyLogSumNoise(size, size, (x, y) => euclidean(x, y) / (0.01 + manhattan(x, y)), 0.1, 0.5), size, size), size, `${OUTPUT_DIRECTORY}/noise-soup-worleylogsum-custom2.png`);
