import { forEachPixel } from '../utils/picture';
import { makeValueNoise } from '../noise/valueNoise';
import { UpscaleSamplers } from '../utils/upscale';
import { makePerlinNoise, makePerlinNoise2 } from '../noise/perlinNoise';
import { makeOctavePerlinNoise, makeOctaveSimplexNoise } from '../noise/fractalNoise';
import { makeSimplexNoise } from '../noise/simplexNoise';
import { mkdirs } from '../utils/fs';
import { plotNoise } from './util';
import { setRandomSeed } from '../utils/random';

const OUTPUT_DIRECTORY = `${__dirname}/../output/noise`;
mkdirs(OUTPUT_DIRECTORY);

const size = 1024;

setRandomSeed(100);

// different interpolation methods give different aspect to the final noise
plotNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.NearestNeighbor), size, `${OUTPUT_DIRECTORY}/noise-value-nearestneighbor.png`);
plotNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.Bilinear), size, `${OUTPUT_DIRECTORY}/noise-value-bilinear.png`);
plotNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.Bicosine), size, `${OUTPUT_DIRECTORY}/noise-value-bicosine.png`);
plotNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.Bicubic), size, `${OUTPUT_DIRECTORY}/noise-value-bicubic.png`);

plotNoise(() => makePerlinNoise(size, size), size, `${OUTPUT_DIRECTORY}/noise-perlin.png`);
plotNoise(() => makeSimplexNoise(size, size), size, `${OUTPUT_DIRECTORY}/noise-simplex.png`);

// mixing noises at different frequencies creates a very smooth noise
plotNoise(() => makeOctavePerlinNoise(size, size), size, `${OUTPUT_DIRECTORY}/noise-perlin-octave.png`);
plotNoise(() => makeOctaveSimplexNoise(size, size), size, `${OUTPUT_DIRECTORY}/noise-simplex-octave.png`);

// pre-processing and post-processing the perlin noise enable to create complex textures
const woodPerlin = makePerlinNoise2(size, size, (coords) => {
  coords[0] *= 4;
  coords[1] *= 4;
}, (x) => {
  x = (1 + x) / 2; // normalize
  x = x * 20;
  return x - Math.trunc(x);
});
plotNoise(() => woodPerlin, size, `${OUTPUT_DIRECTORY}/noise-perlin-wood.png`);

const wormPerlin = makePerlinNoise2(size, size, (coords) => {
  coords[0] *= 16;
  coords[1] *= 16;
}, x => Math.abs(x), new Int8Array([ 1, 1,  -1, -1 ]));
plotNoise(() => wormPerlin, size, `${OUTPUT_DIRECTORY}/noise-perlin-worm.png`);

const marblePerlin = makeOctavePerlinNoise(size, size);
forEachPixel(marblePerlin, size, size, (r, g, b, a, i, j, idx) => {
  const intensity = Math.abs(Math.sin((i / size + j / size + 5 * r) * Math.PI));
  marblePerlin[idx + 0] = intensity;
  marblePerlin[idx + 1] = intensity;
  marblePerlin[idx + 2] = intensity;
});
plotNoise(() => marblePerlin, size, `${OUTPUT_DIRECTORY}/noise-perlin-marble.png`);

const woodPerlin2 = makeOctavePerlinNoise(size, size);
const nbRings = 12;
const turbulencePower = 0.2;
forEachPixel(woodPerlin2, size, size, (r, g, b, a, i, j, idx) => {
  const xValue = (i - size / 2) / size;
  const yValue = (j - size / 2) / size;
  const distValue = Math.sqrt(xValue * xValue + yValue * yValue) + r * turbulencePower;
  const intensity = Math.abs(Math.sin(distValue * nbRings * 2 * Math.PI));
  woodPerlin2[idx + 0] = intensity;
  woodPerlin2[idx + 1] = intensity;
  woodPerlin2[idx + 2] = intensity;
});
plotNoise(() => woodPerlin2, size, `${OUTPUT_DIRECTORY}/noise-perlin-wood2.png`);

