import { randomComplex } from '../utils/random';
import { makeIdentity } from '../transform';
import { estimateFlameDomain } from '../ifs/fractal-flame';
import { Attractor } from '../utils/types';

export const estimateAttractorDomain = (attractor: Attractor, initialPointPicker = randomComplex, finalTransform = makeIdentity(), nbIterations = 10000) => {
  return estimateFlameDomain([ attractor ], () => 0, initialPointPicker, finalTransform, nbIterations);
};
