import { mkdirs } from '../utils/fs';
import { plotAttractor } from './util';
import { makeSymmetricIcon, makeSymmetricIconWithNpTerm } from '../attractors/symmetric-icons';
import { makeMixedColorSteal } from '../ifs/fractal-flame';
import { complex } from '../utils/complex';
import { MAVERICK } from '../utils/palette';
import { estimateAttractorDomain } from '../attractors/plot';
import { setRandomSeed } from '../utils/random';
import { scaleDomain } from '../utils/domain';

const OUTPUT_DIRECTORY = `${__dirname}/../output/attractors`;
mkdirs(OUTPUT_DIRECTORY);

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

setRandomSeed(100);
const nbIterations = 100000000;
const initialPointPicker = () => complex(0.01, 0.01);


for (let i = 0; i < SYMMETRIC_ICONS_COEFFS.length; i++) {
  const coeffs = SYMMETRIC_ICONS_COEFFS[i];
  const attractor = makeSymmetricIcon(coeffs[0], coeffs[1], coeffs[2], coeffs[3], coeffs[4], coeffs[5]);

  // we compute automatically the domain of the attractor
  const domain = scaleDomain(estimateAttractorDomain(attractor, initialPointPicker), 1.2);

  // we create a color function that will apply the palette depending on the location of the point and the number of iterations
  const colorFunc = makeMixedColorSteal(MAVERICK, domain.xmax / 2, nbIterations, 0.9, 0.1);

  // and we plot
  plotAttractor(`${OUTPUT_DIRECTORY}/symmetric-icon${i + 1}.png`, 2048, 2048, attractor, initialPointPicker, colorFunc, nbIterations, domain);
}


//   λ      α      β      γ       δ      d   p
const SYMMETRIC_ICONS_NPTERM_COEFFS = [
  // [ 1.5,   -1.0,  -0.2,  -0.75,   0.04,  3,  24 ], // diverge to infinity
  [ -2.5,   8.0,  -0.7,   1.0,   -0.9,   9,  0 ],
  [ -2.38,  10.0, -12.3,  0.75,   0.02,  5,  1 ],
  [ 1.0,   -2.1,   0.0,   1.0,    1.0,   3,  1 ],
  [ -2.225, 1.5,  -0.014, 0.002, -0.02,  57, 0 ],
  [ -2.42,  1.0,  -0.04,  0.14,   0.088, 6,  0 ],
  [ 1.455, -1.0,   0.03, -0.8,   -0.025, 3,  0 ],
];

for (let i = 0; i < SYMMETRIC_ICONS_NPTERM_COEFFS.length; i++) {
  const coeffs = SYMMETRIC_ICONS_NPTERM_COEFFS[i];
  const attractor = makeSymmetricIconWithNpTerm(coeffs[0], coeffs[1], coeffs[2], coeffs[3], coeffs[4], coeffs[5], coeffs[6]);

  // we compute automatically the domain of the attractor
  const domain = scaleDomain(estimateAttractorDomain(attractor, initialPointPicker), 1.2);

  // we create a color function that will apply the palette depending on the location of the point and the number of iterations
  const colorFunc = makeMixedColorSteal(MAVERICK, domain.xmax / 2, nbIterations, 0.9, 0.1);

  // and we plot
  plotAttractor(`${OUTPUT_DIRECTORY}/symmetric-icon-np${i + 1}.png`, 2048, 2048, attractor, initialPointPicker, colorFunc, nbIterations, domain);
}

