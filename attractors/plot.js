import { randomComplex } from '../utils/random';
import { makeIdentity } from '../transform';
import { plotFlame, plotFlameWithColorStealing, estimateFlameDomain } from '../ifs/fractal-flame';


export const plotAttractor = (
  attractor,
  color,
  plotter,
  initialPointPicker = randomComplex,
  finalTransform = makeIdentity(),
  nbIterations = 1000000,
  resetIfOverflow = false
) => {
  // we hack the fractal flame plotter to render the attractor
  plotFlame([ attractor ], () => 0, [ color ], plotter, initialPointPicker, finalTransform, 1, nbIterations, domain, resetIfOverflow);
};

export const plotAttractorWithColorStealing = (
  attractor,
  colorFunc,
  plotter,
  preFinalColor = false,
  initialPointPicker = randomComplex,
  finalTransform = makeIdentity(),
  nbIterations = 1000000,
  resetIfOverflow = false
) => {
  // we hack the fractal flame plotter to render the attractor
  plotFlameWithColorStealing([ attractor ], () => 0, colorFunc, plotter, preFinalColor, initialPointPicker, finalTransform, 1, nbIterations, domain, resetIfOverflow);
};

export const estimateAttractorDomain = (attractor, initialPointPicker = randomComplex, finalTransform = makeIdentity(), nbIterations = 10000) => {
  return estimateFlameDomain([ attractor ], () => 0, initialPointPicker, finalTransform, nbIterations);
};
