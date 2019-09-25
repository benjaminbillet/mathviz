import { makePerlinNoiseFunction } from '../noise/perlinNoise';
import { plotSupersampledVectorField } from './util';
import { mkdirs } from '../utils/fs';
import { complex, mul, sub } from '../utils/complex';
import { setRandomSeed } from '../utils/random';
import { TWO_PI } from '../utils/math';
import { makeOctavePerlinNoiseFunction } from '../noise/fractalNoise';
import { makeSinusoidalFunction, makeSwirlFunction, makeIteratedMandelbrotFunction, makeExponentialFunction, makePolarFunction, makeFanFunction, makeRingsFunction, makeWaveFunction } from '../transform';
import { astroid, kampyle, rectangularHyperbola, superformula, circle, cissoid } from '../utils/parametric';
import { getTolDivergentPalette } from '../utils/palette';

const OUTPUT_DIRECTORY = `${__dirname}/../output/vectorfields`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed(100);

const palette = getTolDivergentPalette(10).map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);

const noise = makePerlinNoiseFunction(1);
const fracnoise = makeOctavePerlinNoiseFunction(4);

const map = (v, xmin, xmax, fxmin, fxmax) => {
  const xDelta = xmax - xmin;
  const fxDelta = fxmax - fxmin;
  const x = (v - xmin) / xDelta;
  return fxmin + x * fxDelta;
};

const size = 1024;

const colorfunc = (i, j, p) => {
  const x = map(noise(p / 1000, 0), -1, 1, 0, 1);
  return palette[Math.trunc(100 * palette.length * x) % palette.length];
};


// a very simple vector field that translate points
plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-translation.png`, size, size, () => complex(0.1, 0.1), colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-noise1.png`, size, size, (z) => {
  const n = TWO_PI * map(fracnoise(z.re, z.im), -1, 1, 0, 1);
  return circle(n);
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-noise2.png`, size, size, (z) => {
  const n = fracnoise(2 * z.re, 2 * z.im);
  return circle(n);
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-noise3.png`, size, size, (z) => {
  const n = 1000 * fracnoise(z.re / 5, z.im / 5);
  return circle(n);
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-noise4.png`, size, size, (z) => {
  const n = 5 * fracnoise(z.re, z.im);
  return complex(n, n);
}, colorfunc);

const sinusoidal = makeSinusoidalFunction();
plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-sinusoidal.png`, size, size, z => sinusoidal(mul(z, 3)), colorfunc);
plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-swirl.png`, size, size, makeSwirlFunction(1, 0), colorfunc);
plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-polar.png`, size, size, makePolarFunction(), colorfunc);
plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-rings.png`, size, size, makeRingsFunction(0.5), colorfunc);
plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-fan.png`, size, size, makeFanFunction(0.5, Math.PI * 1.2), colorfunc);
plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-mandelbrot.png`, size, size, makeIteratedMandelbrotFunction(2, 10), colorfunc);
plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-wave.png`, size, size, makeWaveFunction(0.9, 0.5, 0.5, 0.424), colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-astroid.png`, size, size, (z) => {
  const n = 2 * fracnoise(3 * z.re, 3 * z.im);
  return astroid(n);
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-kampyle.png`, size, size, (z) => {
  const n = TWO_PI * fracnoise(z.re, z.im);
  return kampyle(n);
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-rectangular-hyperbola.png`, size, size, (z) => {
  const n = 10 * fracnoise(2 * z.re, 2 * z.im);
  return rectangularHyperbola(n);
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-superformula.png`, size, size, (z) => {
  const n = 5 * fracnoise(3 * z.re, 3 * z.im);
  return superformula(n, 1, 1, 6, 1, 7, 8);
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-kampyle-superformula.png`, size, size, (z) => {
  const v1 = kampyle(z.re);
  const v2 = superformula(z.im);
  const n2a = TWO_PI * fracnoise(v1.re, v1.im);
  const n2b = TWO_PI * fracnoise(v2.re, v2.im);
  return complex(Math.cos(n2a), Math.sin(n2b));
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-circle-cissoid.png`, size, size, (z) => {
  const n1a = 5 * Math.PI * fracnoise(z.re / 6, z.im / 6);
  const n1b = 5 * Math.PI * fracnoise(z.im / 6, z.re / 6);
  const v1 = circle(n1a);
  const v2 = cissoid(n1b);
  return complex(0.3 * (v2.re - v1.re), 0.3 * (v2.im - v1.im));
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-astroid-kampyle.png`, size, size, (z) => {
  const n1a = 5 * Math.PI * fracnoise(z.re / 6, z.im / 6);
  const n1b = 5 * Math.PI * fracnoise(z.im / 6, z.re / 6);
  const v1 = astroid(n1a);
  const v2 = kampyle(n1b);
  return complex(0.3 * (v2.re - v1.re), 0.3 * (v2.im - v1.im));
}, colorfunc);

// TODO 3D perlin noise instead of this ugly hacking
plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-time.png`, size, size, (z, _, time) => {
  const tNoise = fracnoise(time, 0.5);
  const n1a = Math.PI * (fracnoise(z.re, z.im) + tNoise);
  const n1b = Math.PI * (fracnoise(z.im, z.re) + tNoise);
  const nn = TWO_PI * (fracnoise(n1a, n1b) + tNoise);
  return circle(nn);
}, colorfunc, (_, i) => i / 500);

const vexp = makeExponentialFunction();
const waves = makeWaveFunction(0.9, 0.5, 0.5, 0.424);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-vexp-waves.png`, size, size, (z) => {
  const n1 = 5 * fracnoise(z.re / 5, z.im / 5);
  const n2 = 5 * fracnoise(z.im / 5, z.re / 5);

  const v1 = vexp(complex(n1, n2));
  const v2 = waves(v1);
  return mul(v2, 0.8, v2);
}, colorfunc);

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/vector-misc1.png`, size, size, (z, _, time) => {
  z = mul(z, 3);
  const v1 = waves(z);
  const v2 = sub(v1, z);

  const n1 = 8 * fracnoise(time, 0) * Math.atan2(v1.im, v1.re);
  const n2 = 8 * fracnoise(time + 0.5, 0) * Math.atan2(v2.im, v2.re);

  return complex(Math.cos(v2.re * n1), Math.sin(v1.im + n2));
}, colorfunc, (_, i) => i / 500);

