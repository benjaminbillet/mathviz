import { mkdirs } from '../utils/fs';
import { randomComplex, setRandomSeed, randomIntegerNormal } from '../utils/random';
import { complex } from '../utils/complex';
import { BI_UNIT_DOMAIN, scaleDomain, symmetrizeDomain, adjustDomainRatio } from '../utils/domain';
import { makeMixedColorSteal, generateTransformationSet } from '../ifs/fractal-flame';
import { PURPLE_MAGIC, getBigQualitativePalette, expandPalette } from '../utils/palette';
import { makePeterDeJungAttractor } from '../attractors/peter-de-jong';
import { plotAttractor, plotIfs, plotIfsFlame } from './util';
import { makeMultiPlotter } from '../utils/plotter';
import { makeCyclicSymmetry, makeDihedralSymmetry } from '../utils/symmetry';
import { makeFernIfs, BARNSLEY_FERN_DOMAIN, BARNSLEY_FERN_PROBABILITIES, BARNSLEY_FERN_COEFFICIENTS } from '../ifs/barnsley-fern';
import { makeIdentity, makeScaleFunction, makeSinusoidal, makeLinear } from '../transform';
import { mixColorLinear } from '../utils/color';


const OUTPUT_DIRECTORY = `${__dirname}/../output/symmetry`;
mkdirs(OUTPUT_DIRECTORY);


const size = 2048;
let domain = scaleDomain(BI_UNIT_DOMAIN, 2.5);
const nbIterations = 10000000;
const colorFunc = makeMixedColorSteal(PURPLE_MAGIC, domain.xmax / 2, nbIterations, 0.5, 0.5);
const attractor = makePeterDeJungAttractor(0.970, -1.899, 1.381, -1.506);
const initialPointPicker = () => complex(0.1, 0.1);

// attractor plotter can be configured with custom plotters, i.e., a cyclic symmetry group plotter...
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-C0.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(0)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-C1.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(1)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-C2.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(2)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-C3.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(3)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-C4.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(4)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-C5.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(5)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-C6.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(6)));

// ... or a dihedral symmetry group plotter
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-D0.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(0)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-D1.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(1)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-D2.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(2)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-D3.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(3)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-D4.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(4)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-D5.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(5)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-D6.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(6)));
plotAttractor(`${OUTPUT_DIRECTORY}/attractor-D7.png`, size, size, attractor, initialPointPicker, colorFunc, nbIterations, domain, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(7)));


// ifs plotter accepts the same plotting customization
const ifs = makeFernIfs(BARNSLEY_FERN_COEFFICIENTS, BARNSLEY_FERN_PROBABILITIES);
domain = adjustDomainRatio(symmetrizeDomain(BARNSLEY_FERN_DOMAIN), 1);
plotIfs(`${OUTPUT_DIRECTORY}/fern-C4.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), domain, randomComplex, null, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(4)));
plotIfs(`${OUTPUT_DIRECTORY}/fern-C8.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), domain, randomComplex, null, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(8)));
plotIfs(`${OUTPUT_DIRECTORY}/fern-C11.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), domain, randomComplex, null, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(11)));

plotIfs(`${OUTPUT_DIRECTORY}/fern-D3.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), domain, randomComplex, null, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(3)));
plotIfs(`${OUTPUT_DIRECTORY}/fern-D4.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), domain, randomComplex, null, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(4)));
plotIfs(`${OUTPUT_DIRECTORY}/fern-D5.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), domain, randomComplex, null, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(5)));
plotIfs(`${OUTPUT_DIRECTORY}/fern-D6.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), domain, randomComplex, null, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(6)));


// as well as the fractal flame plotter
const buildAndPlotFlame = async (path, width, height, seed, nbTransformations, nbPoints, nbIterations, wrapPlotter) => {
  // configure the PRNG
  setRandomSeed(seed);

  // we generate a set of transformations that will be picked according to a normal law
  const transforms = generateTransformationSet(nbTransformations, [ makeSinusoidal ], [ makeLinear ]);
  const randomInt = randomIntegerNormal(0, transforms.length, 1, 0.15);

  // we create a palette of 5 colors, and duplicate them to match the number of transform
  // we also make sure that the colors have 0-1 components
  let colors = expandPalette(getBigQualitativePalette(5), transforms.length);
  colors = colors.map(([ r, g, b ]) => [ r / 255, g / 255, b / 255 ]);

  // we unzoom a little bit as a final transform
  const finalTransform = makeScaleFunction(0.8, 0.8);

  // initial points will be picked randomly
  const initialPointPicker = randomComplex;

  // plot the flame
  plotIfsFlame(path, width, height, transforms, randomInt, colors, initialPointPicker, finalTransform, nbPoints, nbIterations, BI_UNIT_DOMAIN, false, mixColorLinear, true, wrapPlotter);
};

// the number of points is high, it can take a lot of time to get a picture
buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-C3.png`, 2048, 2048, 10, 10, 10000, 10000, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(3)));
buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-C4.png`, 2048, 2048, 10, 10, 10000, 10000, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(4)));
buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-C5.png`, 2048, 2048, 10, 10, 10000, 10000, (plotter) => makeMultiPlotter(plotter, makeCyclicSymmetry(5)));

buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-D2.png`, 2048, 2048, 10, 10, 10000, 10000, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(2)));
buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-D3.png`, 2048, 2048, 10, 10, 10000, 10000, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(3)));
buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-D4.png`, 2048, 2048, 10, 10, 10000, 10000, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(4)));
buildAndPlotFlame(`${OUTPUT_DIRECTORY}/flame-D5.png`, 2048, 2048, 10, 10, 10000, 10000, (plotter) => makeMultiPlotter(plotter, makeDihedralSymmetry(5)));
