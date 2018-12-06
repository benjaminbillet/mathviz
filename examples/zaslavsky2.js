import Complex from 'complex.js';
import { makeIdentity } from '../transform';
import { applyContrastBasedScalefactor, convertUnitToRGBA } from '../utils/color';
import { saveImageBuffer } from '../utils/picture';
import { pickRandom } from '../utils/random';
import { makeMixedColorSteal } from '../ifs/fractal-flame';
import { plotAttractorWithColorStealing, estimateAttractorDomain } from '../attractors/plot';
import { FOREST, BOAT, WATERMELON, RUBY, ICE, FIRE, PURPLE_MAGIC } from '../utils/palette';
import { makeZaslavsky } from '../attractors/zaslavsky';
import { makeKrasnoselskijPerturbatedIterator } from '../attractors/perturbation';

// a simple perturbation function
export const makePerturbator = (n = 500) => {
  let callCounter = 0;
  return (z) => {
    callCounter++;
    if (callCounter === n) { // every n iterations, we slightly perturbate the system
      callCounter = 0;
      return new Complex(z.re + 1, z.im + 0.5);
    }
    return z;
  };
};

const PALETTES = [
  RUBY,
  WATERMELON,
  BOAT,
  ICE,
  FIRE,
  FOREST,
  PURPLE_MAGIC,
];

const buildAndPlotAttractor = async (path, width, height, nbIterations) => {
  // we change the behavior of the zaslavsky function by wrapping it into a perturbated Krasnoselskij
  const f = makeKrasnoselskijPerturbatedIterator(makeZaslavsky(3, 5), makePerturbator(), 0);

  // the final transform does nothing
  const finalTransform = makeIdentity();

  // initial point is fixed
  const initialPointPicker = () => new Complex(1, 1);

  // try to find the function domain automatically by pre-plotting all the points
  // (we can't just plot a few iterations, the size of the drawn attractor depends on the number of iterations)
  const domain = estimateAttractorDomain(f, initialPointPicker, finalTransform, nbIterations);
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

// we use a huge number of iterations
buildAndPlotAttractor(`zaslavsky-${new Date().getTime()}.png`, 2048, 2048, 2000000);