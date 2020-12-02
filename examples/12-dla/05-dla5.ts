import { mkdirs } from '../../utils/fs';
import { fillPicture, mapComplexDomainToPixel, saveImageBuffer } from '../../utils/picture';
import { randomComplex, randomInteger, randomScalar, setRandomSeed } from '../../utils/random';
import { NGonParticle, DlaCollisionFunction, DlaMoveFunction } from '../../utils/types';
import { OnParticleStuck, runDiffusionLimitedAggregation } from '../../automata/dla/dla';
import { eulerComplex, complex, ComplexNumber } from '../../utils/complex';
import { drawFilledPolygon } from '../../utils/raster';
import { euclidean2d } from '../../utils/distance';
import { mapRange } from '../../utils/misc';
import { TWO_PI } from '../../utils/math';
import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { withinPolygon, makePolygon } from '../../utils/polygon';
import affine from '../../utils/affine';
import { makeAlphaBlendingPlotter } from '../../utils/plotter';
import { hslToRgb } from '../../utils/color';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/dla`;
mkdirs(OUTPUT_DIRECTORY);

const getVectorTowards = (x: number, y: number, targetX: number, targetY: number, force = 1) => {
  const theta = Math.atan2(targetY - y, targetX - x);
  return complex(Math.cos(theta) * force, Math.sin(theta) * force);
}

const minRadius = 30;
const maxRadius = 40;

export interface CustomParticle extends NGonParticle {
  hue: number,
}

const polygonCollision: DlaCollisionFunction<CustomParticle> = (particle1, particle2) => {
  const distance = euclidean2d(particle1.position.re, particle1.position.im, particle2.position.re, particle2.position.im);
  if (distance <= (particle1.radius + particle2.radius)) {
    const polygon1 = particle1.polygon.map(x => x.add(particle1.position));
    const polygon2 = particle2.polygon.map(x => x.add(particle2.position));

    const polygon1InsidePolygon2 = polygon1.some((p => withinPolygon(p, polygon2)));
    if (polygon1InsidePolygon2) {
      return true;
    }
    return polygon2.some((p => withinPolygon(p, polygon1)));
  }
  return false;
};

const makeBrownianMotionWithBiasTowards = (towards: ComplexNumber): DlaMoveFunction<CustomParticle> => {
  return (particle) => {
    const bias = getVectorTowards(particle.position.re, particle.position.im, towards.re, towards.im);
    bias.re += randomScalar(-1, 1);
    bias.im += randomScalar(-1, 1);
    bias.normalize(bias);

    particle.position.re += bias.re;
    particle.position.im += bias.im;

    return particle;
  };
};

// when a particle collide with a stuck particle, it gets the same hue but with a small shift
const onParticleStuck: OnParticleStuck<CustomParticle> = (particle, collidedWith) => {
  particle.hue = (collidedWith.hue + 5) % 360;
};

const buildAndPlotDla = (iterations = 100) => {
  const path = `${OUTPUT_DIRECTORY}/dla5.png`;
  const width = 100 * maxRadius * 2;
  const height = 100 * maxRadius * 2;

  setRandomSeed('dioptase'); // make sure that all images have the same randomness sequence

  const nbParticles = 5000;
  const nbStuckParticles = 50;

  const stuckParticles: CustomParticle[] = new Array(nbStuckParticles).fill(null).map((_, i) => {
    const theta = TWO_PI * i / nbStuckParticles;
    const position = mapComplexDomainToPixel(complex(0.2 * Math.cos(theta), 0.2 * Math.sin(theta)), BI_UNIT_DOMAIN, width, height);
    return { position, radius: maxRadius, polygon: makePolygon(6, 0, 0, maxRadius), n: 6, rotation: 0, hue: mapRange(i, 0, nbStuckParticles, 0, 360) };
  });
  const movingParticles: CustomParticle[] = new Array(nbParticles).fill(null).map(() => {
    const n = randomInteger(3, 6);
    const radius = randomInteger(minRadius, maxRadius);
    const rotation = randomScalar(0, TWO_PI);
    const f = affine.makeAffine2dFromMatrix(affine.combine(affine.rotate(rotation)));
    const polygon = makePolygon(n, 0, 0, radius).map(x => f(x));

    const base = eulerComplex(randomScalar(0, TWO_PI)).mul(randomComplex(0.3, 1));
    const position = mapComplexDomainToPixel(base, BI_UNIT_DOMAIN, width, height);
    return { position, radius, polygon, n, rotation, hue: 0 };
  });

  const brownianMotion = makeBrownianMotionWithBiasTowards(complex(width / 2, height / 2));

  // we create a buffer for drawing
  const buffer = fillPicture(new Float32Array(width * height * 4), 0.2, 0.2, 0.2, 1);
  const plotter = makeAlphaBlendingPlotter(buffer, width, height);

  const resultUniverse = runDiffusionLimitedAggregation({ movingParticles, stuckParticles }, polygonCollision, brownianMotion, onParticleStuck, iterations);
  resultUniverse.stuckParticles.forEach((particle) => {
    const alpha = mapRange(particle.radius, minRadius, maxRadius, 0.6, 0.8);
    const color = hslToRgb(particle.hue, 0.8, 0.7, alpha);

    const f = affine.makeAffine2dFromMatrix(affine.combine(affine.rotate(particle.rotation)));
    const polygon = makePolygon(particle.n, 0, 0, particle.radius).map(x => f(x).add(particle.position));

    drawFilledPolygon(polygon, color, plotter);
  });

  saveImageBuffer(buffer, width, height, path);
};

buildAndPlotDla(2000);