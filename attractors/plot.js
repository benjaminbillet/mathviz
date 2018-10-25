import { randomComplex } from '../utils/random';
import { makeIdentity } from '../transform';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { plotFlame, plotFlameWithColorStealing } from '../ifs/fractal-flame';


export const plotAttractor = (output, width, height, f, color, initialPointPicker = randomComplex, finalTransform = makeIdentity(), nbIterations = 1000000, domain = BI_UNIT_DOMAIN, resetIfOverflow = false) => {
  // we hack the fractal flame plotter to render the attractor
  plotFlame(output, width, height, [ f ], () => 0, [ color ], initialPointPicker, finalTransform, 1, nbIterations, domain, resetIfOverflow);
};

export const plotAttractorWithColorStealing = (output, width, height, f, colorFunc, preFinalColor = false, initialPointPicker = randomComplex, finalTransform = makeIdentity(), nbIterations = 1000000, domain = BI_UNIT_DOMAIN, resetIfOverflow = false) => {
  // we hack the fractal flame plotter to render the attractor
  plotFlameWithColorStealing(output, width, height, [ f ], () => 0, colorFunc, preFinalColor, initialPointPicker, finalTransform, 1, nbIterations, domain, resetIfOverflow);
};

export const estimateAttractorDomain = (f, initialPointPicker = randomComplex, finalTransform = makeIdentity(), nbIterations = 10000) => {
  return estimateFlameDomain([ f ], () => 0, initialPointPicker, finalTransform, nbIterations);
};
