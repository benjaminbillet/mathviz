import { mkdirs } from '../utils/fs';
import { plotAttractor } from './util';
import { makeMixedColorSteal } from '../ifs/fractal-flame';
import { complex } from '../utils/complex';
import { MAVERICK } from '../utils/palette';
import { estimateAttractorDomain } from '../attractors/plot';
import { setRandomSeed } from '../utils/random';
import { scaleDomain } from '../utils/domain';
import { makeGumowskiMira } from '../attractors/gumowski-mira';
import { makeIdentity } from '../transform';

const OUTPUT_DIRECTORY = `${__dirname}/../output/attractors`;
mkdirs(OUTPUT_DIRECTORY);

// x0       y0       a       mu
const GUMOWSKI_MIRA_COEFFS = [
  [ 0,        0.5,    0.008,  -0.7 ],
  [ 0,        0.5,    0.0,     0.2715 ],
  [ 5,        5,      0.0,    -0.5501 ],
  [ -10,      10,     0.0,    -0.05 ],
  [ 0,        0.5,    0.0,    -0.15 ],
  [ -5,       5,      0.0,    -0.2 ],
  [ -5,       5,      0.0,    -0.22 ],
  [ 5,        10,     0.0,    -0.23 ],
  [ 0.1,      0.1,    0.008,  -0.9 ],
  [ 0.1,      0.1,    0.008,  -0.6 ],
  [ 0.1,      0.1,    0.008,  -0.4 ],
  [ 0.1,      0.1,    0.008,   0.5 ],
  [ 0.1,      0.1,    0.008,  -0.8 ],
  [ -0.7231, -0.3275, 0.7925,  0.3457 ],
  [ -0.3128, -0.7108, 0.5791, -0.8204 ],
  [ -0.3258,  0.4857, 0.0626, -0.4367 ],
  [ 0.7866,   0.9193, 0.9002,  0.6612 ],
  [ -5,       5,      0.0,     0.070747 ],
  [ -5,       5,      0.0,     0.222263 ],
  [ -5,       5,      0.0,     0.13458 ],
  [ -5,       5,      0.0,     0.11705 ],
  [ -5,       5,      0.0,     0.06885 ],
];


setRandomSeed(100);
const nbIterations = 10000000;


for (let i = 0; i < GUMOWSKI_MIRA_COEFFS.length; i++) {
  const coeffs = GUMOWSKI_MIRA_COEFFS[i];
  const initialPointPicker = () => complex(coeffs[0], coeffs[1]);
  const attractor = makeGumowskiMira(coeffs[2], coeffs[3]);

  // we compute automatically the domain of the attractor
  const domain = scaleDomain(estimateAttractorDomain(attractor, initialPointPicker, makeIdentity(), 100000), 1.2);
  console.log('Estimated domain', domain);

  // we create a color function that will apply the palette depending on the location of the point and the number of iterations
  const colorFunc = makeMixedColorSteal(MAVERICK, domain.xmax / 2, nbIterations, 0.99, 0.01);

  // and we plot
  plotAttractor(`${OUTPUT_DIRECTORY}/gumowski-mira${i + 1}.png`, 2048, 2048, attractor, initialPointPicker, colorFunc, nbIterations, domain);
}
