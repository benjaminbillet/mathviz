import { randomComplex } from '../utils/random';
import { makeIdentity } from '../transform';
import { plotFlameWithColorStealing } from '../ifs/fractal-flame';
import { FOREST } from '../utils/palette';
import { applyContrastBasedScalefactor, makeColorMapFunction, buildColorMap } from '../utils/color';
import { clampInt } from '../utils/misc';
import { saveImageBuffer } from '../utils/picture';
import { makeDoily } from '../ifs/doily';

const buildAndPlotFlame = async (path, width, height, nbPoints, nbIterations) => {
  // we will hack the fractal flame plotter to draw our doily

  // we only have one function in the IFS
  const transforms = [ makeDoily(2, -1, 200) ];
  const randomInt = () => 0; // the function picker will always pick the single function of the IFS

  const domain = { xmin: -1000, xmax: 1000, ymin: -1000, ymax: 1000 };

  // our color function is based on the distance from the center
  let colorFunc = makeColorMapFunction(buildColorMap(FOREST), 255);
  const distanceColorFunc = (re, im) => {
    const distance = (re * re + im * im) / (domain.xmax * domain.xmax);
    return colorFunc(distance);
  };

  // the final transform does nothing
  const finalTransform = makeIdentity();

  // initial points will be picked randomly in the bi-unit space
  const initialPointPicker = randomComplex;

  // we create a buffer and run the standard plotter
  let buffer = new Float64Array(width * height * 4);
  plotFlameWithColorStealing(buffer, width, height, transforms, randomInt, distanceColorFunc, false, initialPointPicker, finalTransform, nbPoints, nbIterations, domain);

  // we correct the generated image using the contrast-based scalefactor technique
  const averageHits = Math.max(1, (nbPoints * nbIterations) / (width * height));
  applyContrastBasedScalefactor(buffer, width, height, averageHits);

  // we make sure that the colors are proper RGB
  buffer = buffer.map((x, i) => {
    if ((i+1) % 4 === 0) {
      return 255;
    }
    return clampInt(x * 255, 0, 255);
  });

  // and finally save the image
  await saveImageBuffer(buffer, width, height, path);
};

// we use a huge number of iterations and a few points
buildAndPlotFlame(`flame-${new Date().getTime()}.png`, 2048, 2048, 10, 10000000);
