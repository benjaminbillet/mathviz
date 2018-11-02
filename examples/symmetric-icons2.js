import Complex from 'complex.js';
import { makeIdentity } from '../transform';
import { applyContrastBasedScalefactor, convertUnitToRGBA } from '../utils/color';
import { saveImageBuffer } from '../utils/picture';
import { makeSymmetricIconWithNpTerm } from '../attractors/symmetric-icons';
import { pickRandom } from '../utils/random';
import { makeMixedColorSteal } from '../ifs/fractal-flame';
import { plotAttractorWithColorStealing, estimateAttractorDomain } from '../attractors/plot';
import { FOREST, BOAT, WATERMELON, RUBY, ICE, FIRE, PURPLE_MAGIC } from '../utils/palette';
import { scaleDomain } from '../utils/domain';

//   λ      α      β      γ       δ      d   p
const SYMMETRIC_ICONS_NPTERM_COEFFS = [
  // [ 1.5,   -1.0,  -0.2,  -0.75,   0.04,  3,  24 ],
  [ -2.5,   8.0,  -0.7,   1.0,   -0.9,   9,  0 ],
  [ -2.38,  10.0, -12.3,  0.75,   0.02,  5,  1 ],
  [ 1.0,   -2.1,   0.0,   1.0,    1.0,   3,  1 ],
  [ -2.225, 1.5,  -0.014, 0.002, -0.02,  57, 0 ],
  [ -2.42,  1.0,  -0.04,  0.14,   0.088, 6,  0 ],
  [ 1.455, -1.0,   0.03, -0.8,   -0.025, 3,  0 ],
];

const PALETTES = [
  RUBY,
  WATERMELON,
  BOAT,
  ICE,
  FIRE,
  FOREST,
  PURPLE_MAGIC,
];

const buildAndPlotAttractor = async (coeffs, path, width, height, nbIterations) => {
  // the function to plot
  const f = makeSymmetricIconWithNpTerm(...coeffs);

  // the final transform does nothing
  const finalTransform = makeIdentity();

  // initial point is fixed
  const initialPointPicker = () => new Complex(0.01, 0.01);

  // try to find the function domain automatically by plotting only a few points
  const domain = scaleDomain(estimateAttractorDomain(f, initialPointPicker, finalTransform), 1.2);
  console.log('Estimated domain', domain);

  // our color function is based on a mix of distance from the center and number of iterations
  const palette = pickRandom(PALETTES);
  const colorFunc = makeMixedColorSteal(palette, domain.xmax / 2, nbIterations);

  // we create a buffer and run the standard plotter
  let buffer = new Float64Array(width * height * 4);
  plotAttractorWithColorStealing(buffer, width, height, f, colorFunc, false, initialPointPicker, finalTransform, nbIterations, domain);

  // we correct the generated image using the contrast-based scalefactor technique
  const averageHits = Math.max(1, nbIterations / (width * height));
  applyContrastBasedScalefactor(buffer, width, height, averageHits);

  // we make sure that the colors are proper RGBA
  buffer = convertUnitToRGBA(buffer);

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

// plot all the attractors
const plotAllAttractors = async (width, height, nbIterations) => {
  for (let i = 0; i < SYMMETRIC_ICONS_NPTERM_COEFFS.length; i++) {
    await buildAndPlotAttractor(SYMMETRIC_ICONS_NPTERM_COEFFS[i], `symmetric-icon-${new Date().getTime()}.png`, width, height, nbIterations);
  }
};

// we use a huge number of iterations
plotAllAttractors(2048, 2048, 1000000000);
