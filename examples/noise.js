import { saveImageBuffer, forEachPixel } from '../utils/picture';
import { convertUnitToRGBA } from '../utils/color';
import { makeValueNoise } from '../noise/valueNoise';
import { UpscaleSamplers } from '../utils/upscale';
import { makeWorleyNoise, makeWorleyLogSumNoise } from '../noise/worleyNoise';
import { euclidean2d, manhattan2d, chebyshev2d, euclidean, manhattan, chebyshev } from '../utils/distance';
import { makePerlinNoise, makePerlinNoise2 } from '../noise/perlinNoise';
import { makeOctavePerlinNoise, makeOctaveSimplexNoise } from '../noise/fractalNoise';
import { makeSimplexNoise } from '../noise/simplexNoise';
import { makeSoupNoise } from '../noise/soupNoise';

const buildNoise = async (noiseFunction, size, outputPath) => {
  const noise = noiseFunction();
  const output = convertUnitToRGBA(noise);
  await saveImageBuffer(output, size, size, outputPath);
};

const buildNoises = async (size) => {
  await buildNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.NearestNeighbor), size, 'noise-value-nearestneighbor.png');
  await buildNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.Bilinear), size, 'noise-value-bilinear.png');
  await buildNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.Bicosine), size, 'noise-value-bicosine.png');
  await buildNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.Bicubic), size, 'noise-value-bicubic.png');

  await buildNoise(() => makePerlinNoise(size, size), size, 'noise-perlin.png');
  await buildNoise(() => makeOctavePerlinNoise(size, size), size, 'noise-perlin-octave.png');
  await buildNoise(() => makeSimplexNoise(size, size), size, 'noise-simplex.png');
  await buildNoise(() => makeOctaveSimplexNoise(size, size), size, 'noise-simplex-octave.png');

  const woodPerlin = makePerlinNoise2(size, size, (coords) => {
    coords[0] *= 4;
    coords[1] *= 4;
  }, (x) => {
    x = (1 + x) / 2; // normalize
    x = x * 20;
    return x - Math.trunc(x);
  });
  await buildNoise(() => woodPerlin, size, 'noise-perlin-wood.png');

  const marblePerlin = makeOctavePerlinNoise(size, size);
  forEachPixel(marblePerlin, size, size, (r, g, b, a, i, j, idx) => {
    const intensity = Math.abs(Math.sin((i / size + j / size + 5 * r) * Math.PI));
    marblePerlin[idx + 0] = intensity;
    marblePerlin[idx + 1] = intensity;
    marblePerlin[idx + 2] = intensity;
  });
  await buildNoise(() => marblePerlin, size, 'noise-perlin-marble.png');

  const wormPerlin = makePerlinNoise2(size, size, (coords) => {
    coords[0] *= 16;
    coords[1] *= 16;
  }, x => Math.abs(x), new Int8Array([ 1, 1,  -1, -1 ]));
  await buildNoise(() => wormPerlin, size, 'noise-perlin-worm.png');


  await buildNoise(() => makeWorleyNoise(size, size, euclidean2d), size, 'noise-worley-euclidean.png');
  await buildNoise(() => makeWorleyNoise(size, size, euclidean2d, 0.1, 6), size, 'noise-worley-euclidean-6th.png');
  await buildNoise(() => makeWorleyNoise(size, size, manhattan2d), size, 'noise-worley-manhattan.png');
  await buildNoise(() => makeWorleyNoise(size, size, chebyshev2d), size, 'noise-worley-chebyshev.png');
  await buildNoise(() => makeWorleyNoise(size, size, (x1, y1, x2, y2) => euclidean2d(Math.sin(x1 * 0.01), Math.sin(y1 * 0.01), Math.sin(x2 * 0.01), Math.sin(y2 * 0.01))), size, 'noise-worley-custom.png');
  await buildNoise(() => makeWorleyLogSumNoise(size, size, euclidean), size, 'noise-worleylogsum-euclidean.png');

  await buildNoise(() => makeSoupNoise(makeWorleyLogSumNoise(size, size, chebyshev), size, size), size, 'noise-soup-worleylogsum-chebyshev.png');
  await buildNoise(() => makeSoupNoise(makeWorleyNoise(size, size, euclidean2d), size, size), size, 'noise-soup-worley-euclidean.png');
  await buildNoise(() => makeSoupNoise(makeWorleyLogSumNoise(size, size, (x, y) => Math.sin(x * 0.01 + y * 0.01)), size, size), size, 'noise-soup-worleylogsum-custom1.png');
  await buildNoise(() => makeSoupNoise(makeWorleyLogSumNoise(size, size, (x, y) => euclidean(x, y) / (0.01 + manhattan(x, y)), 0.1, 0.5), size, size), size, 'noise-soup-worleylogsum-custom2.png');
  await buildNoise(() => makeSoupNoise(woodPerlin, size, size), size, 'noise-soup-perlinwood.png');
  await buildNoise(() => makeSoupNoise(marblePerlin, size, size), size, 'noise-soup-perlinmarble.png');
  await buildNoise(() => makeSoupNoise(wormPerlin, size, size), size, 'noise-soup-worm.png');
};

buildNoises(1024);
