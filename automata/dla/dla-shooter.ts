import { Particle, DlaCollisionFunction, DlaMoveFunction } from '../../utils/types';
import { OnParticleStuck } from './dla';


// a fake DLA approach, where particles are shot instead of moving randomly


export const runDiffusionLimitedAggregationShooter = <S extends Particle> (
  universe: S[],
  collisionFunction: DlaCollisionFunction<S>,
  moveFunction: DlaMoveFunction<S>,
  birthFunction: () => S,
  walkMax: number,
  onParticleStuck: OnParticleStuck<S> = () => {},
  iterations: number
) => {
  for (let i = 0; i < iterations; i++) {
    // create a new particle and fire it
    let particle = birthFunction();

    for (let j = 0; j < walkMax; j++) {
      // move the particle
      particle = moveFunction(particle);

      // check collisions
      const stuck = universe.some((stuckParticle) => {
        if (collisionFunction(particle, stuckParticle)) {
          onParticleStuck(particle, stuckParticle);
          universe.push(particle);
          return true;
        }
        return false;
      });
      if (stuck) {
        break;
      }
    }
  }
  return universe;
};
