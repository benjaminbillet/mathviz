import { mkdirs } from '../../utils/fs';
import { complex, mul, sub } from '../../utils/complex';
import { setRandomSeed } from '../../utils/random';
import { TWO_PI } from '../../utils/math';
import { makeOctavePerlinNoiseFunction } from '../../noise/fractalNoise';
import { makeSinusoidalFunction, makeSwirlFunction, makeIteratedMandelbrotFunction, makeExponentialFunction, makePolarFunction, makeFanFunction, makeRingsFunction, makeWaveFunction } from '../../transform';
import { astroid, kampyle, rectangularHyperbola, superformula, circle, cissoid } from '../../utils/parametric';
import { mapRange } from '../../utils/misc';
import { VectorFieldFunction } from '../../utils/types';
import { mapPixelToComplexDomain, saveImageBuffer } from '../../utils/picture';
import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { applyLicToNoise } from '../../vector-field/lic';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/vectorfields`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed('dioptase');

const fracnoise = makeOctavePerlinNoiseFunction(4);

const size = 1024;

const discretizeVectorFieldFunction = (width: number, height: number, vectorFunc: VectorFieldFunction) => {
  const vectors = new Float32Array(width * height * 2).fill(0);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const fz = mapPixelToComplexDomain(i, j, width, height, BI_UNIT_DOMAIN);
      const v = vectorFunc(fz, 0, 0);
      const idx = (i + j * width) * 2;
      vectors[idx + 0] = v.re;
      vectors[idx + 1] = v.im;
    }
  }
  return vectors;
};

const plotLic = (name: string, vectorFunc: VectorFieldFunction) => {
  const out = applyLicToNoise(discretizeVectorFieldFunction(size, size, vectorFunc), size, size);
  saveImageBuffer(out, size, size, `${OUTPUT_DIRECTORY}/vector-${name}-lic.png`);
};

// a very simple vector field that translate points
plotLic('translation', () => complex(0.5, 0.5));

plotLic('noise1', (z) => {
  const n = TWO_PI * mapRange(fracnoise(z.re, z.im), -1, 1, 0, 1);
  return circle(n);
});

plotLic('noise2', (z) => {
  const n = fracnoise(2 * z.re, 2 * z.im);
  return circle(n);
});

plotLic('noise3', (z) => {
  const n = 1000 * fracnoise(z.re / 5, z.im / 5);
  return circle(n);
});

plotLic('noise4', (z) => {
  const n = 5 * fracnoise(z.re, z.im);
  return complex(n, n);
});

const sinusoidal = makeSinusoidalFunction();
plotLic('sinusoidal', z => sinusoidal(mul(z, 3)));
plotLic('swirl', makeSwirlFunction(1, 0));
plotLic('polar', makePolarFunction());
plotLic('rings', makeRingsFunction(0.5));
plotLic('fan', makeFanFunction(0.5, Math.PI * 1.2));
plotLic('mandelbrot', makeIteratedMandelbrotFunction(2, 10));
plotLic('wave', makeWaveFunction(0.9, 0.5, 0.5, 0.424));

plotLic('astroid', (z) => {
  const n = 2 * fracnoise(3 * z.re, 3 * z.im);
  return astroid(n);
});

plotLic('kampyle', (z) => {
  const n = TWO_PI * fracnoise(z.re, z.im);
  return kampyle(n);
});

plotLic('rectangular-hyperbola', (z) => {
  const n = 10 * fracnoise(2 * z.re, 2 * z.im);
  return rectangularHyperbola(n);
});

plotLic('superformula', (z) => {
  const n = 5 * fracnoise(3 * z.re, 3 * z.im);
  return superformula(n, 1, 1, 6, 1, 7, 8);
});

plotLic('kampyle-superformula', (z) => {
  const v1 = kampyle(z.re);
  const v2 = superformula(z.im);
  const n2a = TWO_PI * fracnoise(v1.re, v1.im);
  const n2b = TWO_PI * fracnoise(v2.re, v2.im);
  return complex(Math.cos(n2a), Math.sin(n2b));
});

plotLic('circle-cissoid', (z) => {
  const n1a = 5 * Math.PI * fracnoise(z.re / 6, z.im / 6);
  const n1b = 5 * Math.PI * fracnoise(z.im / 6, z.re / 6);
  const v1 = circle(n1a);
  const v2 = cissoid(n1b);
  return complex(0.3 * (v2.re - v1.re), 0.3 * (v2.im - v1.im));
});

plotLic('astroid-kampyle', (z) => {
  const n1a = 5 * Math.PI * fracnoise(z.re / 6, z.im / 6);
  const n1b = 5 * Math.PI * fracnoise(z.im / 6, z.re / 6);
  const v1 = astroid(n1a);
  const v2 = kampyle(n1b);
  return complex(0.3 * (v2.re - v1.re), 0.3 * (v2.im - v1.im));
});

// TODO 3D perlin noise instead of this ugly hacking
plotLic('time', (z, _, time) => {
  const tNoise = fracnoise(time, 0.5);
  const n1a = Math.PI * (fracnoise(z.re, z.im) + tNoise);
  const n1b = Math.PI * (fracnoise(z.im, z.re) + tNoise);
  const nn = TWO_PI * (fracnoise(n1a, n1b) + tNoise);
  return circle(nn);
});

const vexp = makeExponentialFunction();
const waves = makeWaveFunction(0.9, 0.5, 0.5, 0.424);

plotLic('vexp-waves', (z) => {
  const n1 = 5 * fracnoise(z.re / 5, z.im / 5);
  const n2 = 5 * fracnoise(z.im / 5, z.re / 5);

  const v1 = vexp(complex(n1, n2));
  const v2 = waves(v1);
  return mul(v2, 0.8, v2);
});

plotLic('misc1', (z, _, time) => {
  z = mul(z, 3);
  const v1 = waves(z);
  const v2 = sub(v1, z);

  const n1 = 8 * fracnoise(time, 0) * Math.atan2(v1.im, v1.re);
  const n2 = 8 * fracnoise(time + 0.5, 0) * Math.atan2(v2.im, v2.re);

  return complex(Math.cos(v2.re * n1), Math.sin(v1.im + n2));
});
