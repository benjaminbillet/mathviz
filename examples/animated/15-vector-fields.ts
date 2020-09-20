import { mkdirs } from '../../utils/fs';
import { animateFunction } from './util';
import { plotSupersampledVectorField } from '../util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { getTolDivergentPalette } from '../../utils/palette';
import { makeWaveFunction } from '../../transform';
import { circle } from '../../utils/parametric';
import { makeOctavePerlinNoiseFunction } from '../../noise/fractalNoise';
import { makePerlinNoiseFunction } from '../../noise/perlinNoise';
import { mapRange } from '../../utils/misc';
import { complex, sub, mul } from '../../utils/complex';
import { Color, ColorSteal, Palette } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-vectorfields`;
mkdirs(OUTPUT_DIRECTORY);

const size = 1024;

const palette: Palette = getTolDivergentPalette(10).map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);
const noise = makePerlinNoiseFunction(1);
const fracnoise = makeOctavePerlinNoiseFunction(4);

const colorfunc: ColorSteal = (i, j, p) => {
  const x = mapRange(noise(p / 1000, 0), -1, 1, 0, 1);
  return palette[Math.trunc(100 * palette.length * x) % palette.length];
};

animateFunction(async (iterations, _, path) => {
  setRandomSeed(100);
  await plotSupersampledVectorField(path, size, size, (z) => {
    const n = 5 * fracnoise(z.re, z.im);
    return complex(n, n);
  }, colorfunc, () => 0, iterations);
}, 1, 500, Easing.linear, 100, OUTPUT_DIRECTORY, 'vector-noise');

animateFunction(async (iterations, _, path) => {
  setRandomSeed(100);
  await plotSupersampledVectorField(path, size, size, (z) => {
    const n = 1000 * fracnoise(z.re / 5, z.im / 5);
    return circle(n);
  }, colorfunc, () => 0, iterations);
}, 1, 500, Easing.linear, 100, OUTPUT_DIRECTORY, 'vector-noise2');

const waves = makeWaveFunction(0.9, 0.5, 0.5, 0.424);

animateFunction(async (iterations, _, path) => {
  setRandomSeed(100);
  await plotSupersampledVectorField(path, size, size, (z, _, time) => {
    z = mul(z, 3);
    const v1 = waves(z);
    const v2 = sub(v1, z);

    const n1 = 8 * fracnoise(time, 0) * Math.atan2(v1.im, v1.re);
    const n2 = 8 * fracnoise(time + 0.5, 0) * Math.atan2(v2.im, v2.re);

    return complex(Math.cos(v2.re * n1), Math.sin(v1.im + n2));
  }, colorfunc, (_, i) => i / 500, iterations);
}, 1, 500, Easing.linear, 100, OUTPUT_DIRECTORY, 'vector-misc');

