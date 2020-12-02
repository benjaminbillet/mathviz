import { Particle, DlaUniverse, DlaCollisionFunction, DlaMoveFunction } from '../../utils/types';

export type OnParticleStuck<S extends Particle> = (particle: S, collidedWith: S) => void;

export const runDiffusionLimitedAggregation = <S extends Particle> (
  universe: DlaUniverse<S>,
  collisionFunction: DlaCollisionFunction<S>,
  moveFunction: DlaMoveFunction<S>,
  onParticleStuck: OnParticleStuck<S> = () => {},
  iterations = 1
) => {
  let currentUniverse = universe;
  for (let i = 0; i < iterations; i++) {
    const nextUniverse: DlaUniverse<S> = {
      stuckParticles: currentUniverse.stuckParticles,
      movingParticles: [],
    };

    currentUniverse.movingParticles.forEach((particle) => {
      // move the particles
      particle = moveFunction(particle);

      // check collisions
      const stuck = currentUniverse.stuckParticles.some((stuckParticle) => {
        if (collisionFunction(particle, stuckParticle)) {
          onParticleStuck(particle, stuckParticle);
          nextUniverse.stuckParticles.push(particle);
          return true;
        }
        return false;
      });
      if (!stuck) {
        nextUniverse.movingParticles.push(particle);
      }
    });

    currentUniverse = nextUniverse;
  }
  return currentUniverse;
};
