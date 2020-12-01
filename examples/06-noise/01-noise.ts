import { makeValueNoise } from '../../noise/valueNoise';
import { UpscaleSamplers } from '../../utils/upscale';
import { makePerlinNoiseFunction, makePerlinNoiseFunction2 } from '../../noise/perlinNoise';
import { makeOctavePerlinNoiseFunction, makeOctaveSimplexNoiseFunction, makeOctaveNoiseFunction } from '../../noise/fractalNoise';
import { makeSimplexNoiseFunction } from '../../noise/simplexNoise';
import { mkdirs } from '../../utils/fs';
import { plotNoise, plotNoiseFunction } from '../util';
import { setRandomSeed } from '../../utils/random';
import { NoiseFunction2D, NoiseMaker2D, RealToRealFunction } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/noise`;
mkdirs(OUTPUT_DIRECTORY);

const size = 1024;

setRandomSeed('dioptase');

// different interpolation methods give different aspect to the final noise
plotNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.NearestNeighbor), size, `${OUTPUT_DIRECTORY}/noise-value-nearestneighbor.png`);
plotNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.Bilinear), size, `${OUTPUT_DIRECTORY}/noise-value-bilinear.png`);
plotNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.Bicosine), size, `${OUTPUT_DIRECTORY}/noise-value-bicosine.png`);
plotNoise(() => makeValueNoise(128, 128, size, size, UpscaleSamplers.Bicubic), size, `${OUTPUT_DIRECTORY}/noise-value-bicubic.png`);

plotNoiseFunction(makePerlinNoiseFunction(), size, `${OUTPUT_DIRECTORY}/noise-perlin.png`);
plotNoiseFunction(makeSimplexNoiseFunction(), size, `${OUTPUT_DIRECTORY}/noise-simplex.png`);

// mixing noises at different frequencies creates a very smooth noise
plotNoiseFunction(makeOctavePerlinNoiseFunction(), size, `${OUTPUT_DIRECTORY}/noise-perlin-octave.png`);
plotNoiseFunction(makeOctaveSimplexNoiseFunction(), size, `${OUTPUT_DIRECTORY}/noise-simplex-octave.png`);

// pre-processing and post-processing the perlin noise enable to create complex textures
const woodPerlin = makePerlinNoiseFunction2((coords) => {
  coords[0] *= 4;
  coords[1] *= 4;
}, (x) => {
  x = (1 + x) / 2; // normalize
  x = x * 20;
  return x - Math.trunc(x);
});
plotNoiseFunction(woodPerlin, size, `${OUTPUT_DIRECTORY}/noise-perlin-wood.png`);

const wormPerlin = makePerlinNoiseFunction2((coords) => {
  coords[0] *= 16;
  coords[1] *= 16;
}, x => Math.abs(x), new Int8Array([ 1, 1,  -1, -1 ]));
plotNoiseFunction(wormPerlin, size, `${OUTPUT_DIRECTORY}/noise-perlin-worm.png`);

const fractalPerlin = makeOctavePerlinNoiseFunction();
const marblePerlin: NoiseFunction2D = (x, y) => Math.abs(Math.sin((x + y + 5 * fractalPerlin(x, y)) * Math.PI));
plotNoiseFunction(marblePerlin, size, `${OUTPUT_DIRECTORY}/noise-perlin-marble.png`);

const nbRings = 12;
const turbulencePower = 0.2;
const woodPerlin2: NoiseFunction2D = (x, y) => {
  const xValue = x - 0.5;
  const yValue = y - 0.5;
  const distValue = Math.sqrt(xValue * xValue + yValue * yValue) + fractalPerlin(x, y) * turbulencePower;
  return Math.abs(Math.sin(distValue * nbRings * 2 * Math.PI));
};
plotNoiseFunction(woodPerlin2, size, `${OUTPUT_DIRECTORY}/noise-perlin-wood2.png`);

plotNoiseFunction((x, y) => Math.pow(Math.sin(10 * x), 3) * Math.cos(Math.pow(10 * y, 2)), size, `${OUTPUT_DIRECTORY}/noise-custom.png`);


const compose = (noiseMaker: NoiseMaker2D, f: RealToRealFunction): NoiseMaker2D => {
  return (frequency) => {
    const noiseFunc = noiseMaker(frequency);
    return (x, y) => f(noiseFunc(x, y));
  };
};

plotNoiseFunction(makeOctaveNoiseFunction(compose(makePerlinNoiseFunction, x => Math.abs(x)), 8, 4), size, `${OUTPUT_DIRECTORY}/noise-octave-billow.png`);
plotNoiseFunction(makeOctaveNoiseFunction(compose(makePerlinNoiseFunction, x => 0.01 / (x + 0.01)), 8, 4, 0.75), size, `${OUTPUT_DIRECTORY}/noise-octave-reciprocal.png`, false);
plotNoiseFunction(makeOctaveNoiseFunction(compose(makePerlinNoiseFunction, x => Math.ceil(x)), 8, 4), size, `${OUTPUT_DIRECTORY}/noise-octave-ceil.png`);

const customPreproc: RealToRealFunction = (x) => {
  x = 1 - Math.abs(x); // invert billow
  return x * x * x; // sharpen
};
plotNoiseFunction(makeOctaveNoiseFunction(compose(makePerlinNoiseFunction, customPreproc), 8, 4), size, `${OUTPUT_DIRECTORY}/noise-octave-custom.png`);
