import { makeTranslation } from './translation';
import { makeRotation } from './rotation';
import { makeScale } from './scale';
import { makeShear } from './shear';
import { pickRandom } from '../utils/random';

export const makeSimpleLinear = () => {
  const linearTransformations = [
    makeTranslation,
    makeRotation,
    makeScale,
    makeShear,
  ];
  return pickRandom(linearTransformations)();
};
