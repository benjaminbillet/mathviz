import { mkdirs } from '../../utils/fs';
import { fillPicture, saveImageBuffer } from '../../utils/picture';
import { randomInteger, randomScalar, setRandomSeed } from '../../utils/random';
import { SphereParticle, DlaCollisionFunction, DlaMoveFunction } from '../../utils/types';
import { OnParticleStuck, runDiffusionLimitedAggregation } from '../../automata/dla/dla';
import { complex, ComplexNumber } from '../../utils/complex';
import { drawFilledCircle } from '../../utils/raster';
import { euclidean2d } from '../../utils/distance';
import { mapRange } from '../../utils/misc';
import { makeAlphaBlendingPlotter } from '../../utils/plotter';
import { hslToRgb } from '../../utils/color';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/dla`;
mkdirs(OUTPUT_DIRECTORY);

const minRadius = 10;
const maxRadius = 40;

export interface CustomParticle extends SphereParticle {
  hue: number,
}

const sphereCollision: DlaCollisionFunction<CustomParticle> = (particle1, particle2) => {
  const distance = euclidean2d(particle1.position.re, particle1.position.im, particle2.position.re, particle2.position.im);
  return distance <= (particle1.radius + particle2.radius);
};

const makeBrownianMotionWithBias = (bias: ComplexNumber): DlaMoveFunction<CustomParticle> => {
  return (particle) => {
    const delta = complex(bias.re + randomScalar(-1, 1), bias.im + randomScalar(-1, 1));
    delta.normalize(bias);

    particle.position.re += delta.re * particle.radius;
    particle.position.im += delta.im * particle.radius;

    return particle;
  };
};

// when a particle collide with a stuck particle, it gets the same hue but with a small shift
const onParticleStuck: OnParticleStuck<CustomParticle> = (particle, collidedWith) => {
  particle.hue = (collidedWith.hue + 1) % 360;
};

const buildAndPlotDla = (iterations = 100) => {
  const path = `${OUTPUT_DIRECTORY}/dla3.png`;
  const width = 100 * maxRadius * 2;
  const height = 100 * maxRadius * 2;

  setRandomSeed('dioptase'); // make sure that all images have the same randomness sequence

  const nbParticles = 10000;

  const stuckParticles: CustomParticle[] = new Array(100).fill(null).map((_, i) => {
    return { position: complex(maxRadius + i * maxRadius * 2, height - maxRadius), hue: randomInteger(0, 360), radius: maxRadius };
  });
  const movingParticles: CustomParticle[] = new Array(nbParticles).fill(null).map(() => {
    const radius = randomInteger(minRadius, maxRadius);
    return { position: complex(randomScalar(0, width), randomScalar(0, height)), hue: 0, radius };
  });

  const brownianMotion = makeBrownianMotionWithBias(complex(0, 1));

  // we create a buffer for drawing
  const buffer = fillPicture(new Float32Array(width * height * 4), 0.2, 0.2, 0.2, 1);
  const plotter = makeAlphaBlendingPlotter(buffer, width, height);

  const resultUniverse = runDiffusionLimitedAggregation({ movingParticles, stuckParticles }, sphereCollision, brownianMotion, onParticleStuck, iterations);
  resultUniverse.stuckParticles.forEach((particle) => {
    const alpha = mapRange(particle.radius, minRadius, maxRadius, 0.6, 0.8);
    const color = hslToRgb(particle.hue, 0.8, 0.7, alpha);
    drawFilledCircle(particle.position.re, particle.position.im, particle.radius, color, plotter);
  });

  saveImageBuffer(buffer, width, height, path);
};

buildAndPlotDla(2000);