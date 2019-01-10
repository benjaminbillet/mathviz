import { randomComplex } from '../utils/random';
import { makeIdentity } from '../transform';
import { makeMixedColorSteal } from '../ifs/fractal-flame';
import { FOREST } from '../utils/palette';
import { applyContrastBasedScalefactor, convertUnitToRGBA } from '../utils/color';
import { saveImageBuffer } from '../utils/picture';
import { makeHopalong } from '../attractors/hopalong';
import { plotAttractorWithColorStealing } from '../attractors/plot';

const buildAndPlotAttractor = async (path, width, height, nbIterations) => {
  // the function to plot and its domain
  const f = makeHopalong(2, -1, 200);
  const domain = { xmin: -1000, xmax: 1000, ymin: -1000, ymax: 1000 };

  // our color function is based on a mix of distance from the center and number of iterations
  const colorFunc = makeMixedColorSteal(FOREST, domain.xmax, nbIterations);

  // the final transform does nothing
  const finalTransform = makeIdentity();

  // initial points will be picked randomly in the bi-unit space
  const initialPointPicker = randomComplex;

  // we create a buffer and run the standard plotter
  let buffer = new Float32Array(width * height * 4);
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
buildAndPlotAttractor(`hopalong-${new Date().getTime()}.png`, 2048, 2048, 100000000);
