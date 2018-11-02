import Complex from 'complex.js';
import { makeIdentity } from '../transform';
import { applyContrastBasedScalefactor, convertUnitToRGBA } from '../utils/color';
import { saveImageBuffer } from '../utils/picture';
import { makeSymmetricIcon } from '../attractors/symmetric-icons';
import { pickRandom } from '../utils/random';
import { makeMixedColorSteal } from '../ifs/fractal-flame';
import { plotAttractorWithColorStealing, estimateAttractorDomain } from '../attractors/plot';
import { FOREST, BOAT, WATERMELON, RUBY, ICE, FIRE, PURPLE_MAGIC } from '../utils/palette';
import { scaleDomain } from '../utils/domain';

//   λ      α      β      γ      ω      d
const SYMMETRIC_ICONS_COEFFS = [
  [ -2.7,   5.0,   1.5,   1.0,   0.0,   6 ],
  [ -2.08,  1.0,  -0.1,   0.167, 0.0,   7 ],
  [ 1.56,  -1.0,   0.1,  -0.82,  0.12,  3 ],
  [ -1.806, 1.806, 0.0,   1.0,   0.0,   5 ],
  [ 1.56,  -1.0,   0.1,  -0.82,  0.0,   3 ],
  [ -2.195, 10.0, -12.0,  1.0,   0.0,   3 ],
  [ -1.86,  2.0,   0.0,   1.0,   0.1,   4 ],
  [ -2.34,  2.0,   0.2,   0.1,   0.0,   5 ],
  [ 2.6,   -2.0,   0.0,  -0.5,   0.0,   5 ],
  [ -2.5,   5.0,  -1.9,   1.0,   0.188, 5 ],
  [ 2.409, -2.5,   0.0,   0.9,   0.0,   23 ],
  [ 2.409, -2.5,  -0.2,   0.81,  0.0,   24 ],
  [ -2.05,  3.0,  -16.79, 1.0,   0.0,   9 ],
  [ -2.32,  2.32,  0.0,   0.75,  0.0,   5 ],
  [ 2.5,   -2.5,   0.0,   0.9,   0.0,   3 ],
  [ 1.455, -1.0,   0.03, -0.8,   0.0,   3 ],
  // [ 2.39,  -2.5,  -0.1,   0.9,   0.0,   6 ],
  // [ 2.39,  -2.5,  -0.1,   0.9,  -0.15,  6 ],
  // [ 1.5,   -1.0,   0.1,  -0.8,   0.0,   2 ],
  [ 1.5,   -1.0,   0.1,  -0.805, 0.0,   3 ],
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
  const f = makeSymmetricIcon(...coeffs);

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
  for (let i = 0; i < SYMMETRIC_ICONS_COEFFS.length; i++) {
    await buildAndPlotAttractor(SYMMETRIC_ICONS_COEFFS[i], `symmetric-icon-${new Date().getTime()}.png`, width, height, nbIterations);
  }
};

// we use a huge number of iterations
plotAllAttractors(2048, 2048, 1000000000);
