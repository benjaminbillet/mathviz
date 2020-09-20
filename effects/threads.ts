import { randomInteger, DefaultNormalDistribution, randomNormal, randomScalar } from '../utils/random';
import { getLuminance } from '../utils/color';
import { PlotBuffer } from '../utils/types';

export const DefaultStrideDistribution = randomNormal(1, 0.05);

export const ObedientBehavior = () => 0;
export const CrosshatchBehavior = () => (Math.floor(DefaultNormalDistribution() * 100) % 2) * Math.PI / 2;
export const ChaoticBehavior = () => DefaultNormalDistribution() * 2 * Math.PI;
export const UnrulyBehavior = () => DefaultNormalDistribution() * 0.25 - 0.125;

// High-level description:
// - we define a set of particles, each particle being able to move (one pixel) at each iterations
// - the direction of particles depends on the luminosity of the source image + some chaos (defined by the behavior parameter)
// - we draw the path followed by each particle, the coloring of the path depending on the number of iterations
export const applyThreads = (input: PlotBuffer, width: number, height: number, density = 4, length = 4, period = 1, strideDistribution = DefaultStrideDistribution, behavior = ObedientBehavior) => {
  const output = new Float32Array(input.length).fill(0);

  const nbParticles = Math.max(width, height) * density;
  const iterations = Math.trunc(Math.sqrt(Math.min(width, height)) * length);
  for (let i = 0; i < nbParticles; i++) {
    let x = randomInteger(0, width - 1);
    let y = randomInteger(0, height - 1);
    const stride = strideDistribution();

    let idx = (x + y * width) * 4;
    const r = input[idx + 0];
    const g = input[idx + 1];
    const b = input[idx + 2];

    const chaos = behavior();

    for (let j = 0; j < iterations; j++) {
      // linear gradient [ 0 .. 1 .. 0 ] for path coloring
      const exposure = 1 - Math.abs(1 - j / (iterations - 1) * 2);
      output[idx + 0] += exposure * r;
      output[idx + 1] += exposure * g;
      output[idx + 2] += exposure * b;

      // compute the luminance and introduce chaos
      let luminance = getLuminance(input[idx + 0], input[idx + 1], input[idx + 2]);
      luminance = luminance * Math.PI * 2 * period + (chaos - Math.PI / 4);

      // modulo + negative number correction
      x = (x + Math.sin(luminance) * stride) % width;
      x = (x + width) % width;
      y = (y + Math.cos(luminance) * stride) % height;
      y = (y + height) % height;

      idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;
    }
  }
  return output;
};

// this is simply a rewritten version that works per iteration instead of per thread
// this is useful if we want to generate one picture per iteration and create animations
export const applyThreads2 = (input: PlotBuffer, width: number, height: number, density = 4, length = 4, period = 1, strideDistribution = DefaultStrideDistribution, behavior = ObedientBehavior, onIterationFinished = (buffer: PlotBuffer, i: number) => {}) => {
  const output: PlotBuffer = new Float32Array(input.length).fill(0);

  const nbParticles = Math.max(width, height) * density;
  const iterations = Math.trunc(Math.sqrt(Math.min(width, height)) * length);

  const particles = new Array(nbParticles).fill({});
  for (let j = 0; j < iterations; j++) {
    for (let i = 0; i < nbParticles; i++) {
      let { x, y, stride, chaos, r, g, b } = particles[i];
      if (j === 0) {
        // initialize the particle (position, stride, behavior and color)
        x = randomInteger(0, width - 1);
        y = randomInteger(0, height - 1);
        const idx = (x + y * width) * 4;
        r = input[idx + 0];
        g = input[idx + 1];
        b = input[idx + 2];
        stride = strideDistribution();
        chaos = behavior();
        particles[i] = { x, y, stride, chaos, r, g, b };
      }

      const idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;

      // linear gradient [ 0 .. 1 .. 0 ] for path coloring
      const exposure = 1 - Math.abs(1 - j / (iterations - 1) * 2);
      output[idx + 0] += exposure * r;
      output[idx + 1] += exposure * g;
      output[idx + 2] += exposure * b;

      // compute the luminance and introduce chaos
      let luminance = getLuminance(input[idx + 0], input[idx + 1], input[idx + 2]);
      luminance = luminance * Math.PI * 2 * period + (chaos - Math.PI / 4);

      // modulo + negative number correction
      x = (x + Math.sin(luminance) * stride) % width;
      x = (x + width) % width;
      y = (y + Math.cos(luminance) * stride) % height;
      y = (y + height) % height;

      particles[i].x = x;
      particles[i].y = y;
    }

    onIterationFinished(output, j);
  }
  return output;
};

export const applyCurlyThreads = (input: PlotBuffer, width: number, height: number, density = 4, length = 4, period = 1, strideDistribution = DefaultStrideDistribution) => {
  const output: PlotBuffer = new Float32Array(input.length).fill(0);

  const nbParticles = Math.max(width, height) * density;
  const iterations = Math.trunc(Math.sqrt(Math.min(width, height)) * length);
  for (let i = 0; i < nbParticles; i++) {
    let x = randomInteger(0, width - 1);
    let y = randomInteger(0, height - 1);
    const stride = strideDistribution();

    let idx = (x + y * width) * 4;
    const r = input[idx + 0];
    const g = input[idx + 1];
    const b = input[idx + 2];

    let theta = randomScalar(0, Math.PI * 2);
    let thetaDecay = 0;
    const thetaDecayDecay = randomScalar(0.00001, 0.001);

    for (let j = 0; j < iterations; j++) {
      // linear gradient [ 0 .. 1 .. 0 ] for path coloring
      const exposure = 1 - Math.abs(1 - j / (iterations - 1) * 2);
      output[idx + 0] += exposure * r;
      output[idx + 1] += exposure * g;
      output[idx + 2] += exposure * b;

      // compute the luminance and introduce chaos
      let luminance = getLuminance(input[idx + 0], input[idx + 1], input[idx + 2]);
      luminance = luminance * Math.PI * 2 * period + theta;

      // update orbit
      theta += thetaDecay;
      thetaDecay += thetaDecayDecay;

      // modulo + negative number correction
      x = (x + Math.sin(luminance) * stride) % width;
      x = (x + width) % width;
      y = (y + Math.cos(luminance) * stride) % height;
      y = (y + height) % height;

      idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;
    }
  }
  return output;
};

export const applyCurlyThreads2 = (input: PlotBuffer, width: number, height: number, density = 4, length = 4, period = 1, strideDistribution = DefaultStrideDistribution, onIterationFinished = (buffer: PlotBuffer, i: number) => {}) => {
  const output: PlotBuffer = new Float32Array(input.length).fill(0);

  const nbParticles = Math.max(width, height) * density;
  const iterations = Math.trunc(Math.sqrt(Math.min(width, height)) * length);

  const particles = new Array(nbParticles).fill({});
  for (let j = 0; j < iterations; j++) {
    for (let i = 0; i < nbParticles; i++) {
      let { x, y, stride, theta, thetaDecay, thetaDecayDecay, r, g, b } = particles[i];
      if (j === 0) {
        // initialize the particle (position, stride, behavior and color)
        x = randomInteger(0, width - 1);
        y = randomInteger(0, height - 1);
        const idx = (x + y * width) * 4;
        r = input[idx + 0];
        g = input[idx + 1];
        b = input[idx + 2];
        stride = strideDistribution();

        theta = randomScalar(0, Math.PI * 2);
        thetaDecay = 0;
        thetaDecayDecay = randomScalar(0.0001, 0.001);
        particles[i] = { x, y, stride, theta, thetaDecay, thetaDecayDecay, r, g, b };
      }

      const idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;

      // linear gradient [ 0 .. 1 .. 0 ] for path coloring
      const exposure = 1 - Math.abs(1 - j / (iterations - 1) * 2);
      output[idx + 0] += exposure * r;
      output[idx + 1] += exposure * g;
      output[idx + 2] += exposure * b;

      // compute the luminance and introduce chaos
      let luminance = getLuminance(input[idx + 0], input[idx + 1], input[idx + 2]);
      luminance = luminance * Math.PI * 2 * period + theta;

      // update orbit
      particles[i].theta += thetaDecay;
      particles[i].thetaDecay += thetaDecayDecay;

      // modulo + negative number correction
      x = (x + Math.sin(luminance) * stride) % width;
      x = (x + width) % width;
      y = (y + Math.cos(luminance) * stride) % height;
      y = (y + height) % height;

      particles[i].x = x;
      particles[i].y = y;
    }

    onIterationFinished(output, j);
  }
  return output;
};
