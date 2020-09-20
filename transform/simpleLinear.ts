import { makeTranslation } from './translation';
import { makeRotation } from './rotation';
import { makeScale } from './scale';
import { makeShear } from './shear';
import { pickRandom } from '../utils/random';
import { Transform2D } from '../utils/types';

export const makeSimpleLinear = (): Transform2D => {
  const linearTransformations = [
    makeTranslation,
    makeRotation,
    makeScale,
    makeShear,
  ];
  return pickRandom(linearTransformations)();
};
