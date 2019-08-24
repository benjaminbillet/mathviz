import { mkdirs } from '../utils/fs';
import { plotAttractor } from './util';
import { makeMixedColorSteal } from '../ifs/fractal-flame';
import { complex } from '../utils/complex';
import { CATERPILLAR } from '../utils/palette';
import { estimateAttractorDomain } from '../attractors/plot';
import { setRandomSeed } from '../utils/random';
import { scaleDomain } from '../utils/domain';
import { makeIdentity } from '../transform';
import { makePeterDeJungAttractor } from '../attractors/peter-de-jong';

const OUTPUT_DIRECTORY = `${__dirname}/../output/attractors`;
mkdirs(OUTPUT_DIRECTORY);

// a       b       c       d
const PETER_DE_JUNG_COEFFS = [
  [ 1.641,   1.902,  0.316,  1.525 ],
  [ -2.24,   0.43,  -0.65,  -2.43 ],
  [ 0.970,  -1.899,  1.381, -1.506 ],
  [ 1.4,    -2.3,    2.4,   -2.1 ],
  [ 2.01,   -2.53,   1.61,  -0.33 ],
  [ -2.7,   -0.09,  -0.86,  -2.2 ],
  [ -0.827, -1.637,  1.659, -0.943 ],
  [ -2.0,   -2.0,   -1.2,    2.0 ],
  [ -0.709,  1.638,  0.452,  1.740 ],
];


const nbIterations = 100000000;

for (let i = 0; i < PETER_DE_JUNG_COEFFS.length; i++) {
  const coeffs = PETER_DE_JUNG_COEFFS[i];
  const attractor = makePeterDeJungAttractor(...coeffs);
  const initialPointPicker = () => complex(0.1, 0.1);

  setRandomSeed(100);

  // we compute automatically the domain of the attractor
  const domain = scaleDomain(estimateAttractorDomain(attractor, initialPointPicker, makeIdentity(), 1000000), 1.2);
  console.log('Estimated domain', domain);

  // we create a color function that will apply the palette depending on the location of the point and the number of iterations
  const colorFunc = makeMixedColorSteal(CATERPILLAR, domain.xmax / 2, nbIterations, 0.5, 0.5);

  // and we plot
  plotAttractor(`${OUTPUT_DIRECTORY}/peter-jung${i + 1}.png`, 2048, 2048, attractor, initialPointPicker, colorFunc, nbIterations, domain);
}
