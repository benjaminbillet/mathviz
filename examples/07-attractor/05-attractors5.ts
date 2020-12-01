import { mkdirs } from '../../utils/fs';
import { plotAttractorMultipoint } from '../util';
import { makeMixedColorSteal } from '../../ifs/fractal-flame';
import { complex } from '../../utils/complex';
import { CATERPILLAR } from '../../utils/palette';
import { estimateAttractorDomain } from '../../attractors/plot';
import { setRandomSeed, randomComplex } from '../../utils/random';
import { scaleDomain } from '../../utils/domain';
import { makeIdentity } from '../../transform';
import { makeQuadrupTwo } from '../../attractors/hopalong';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/attractors`;
mkdirs(OUTPUT_DIRECTORY);

const QUADRUP_TWO_COEFFS = [
  [ -60,  -38,    6,   1 ],
  [ 77,    10,    37,  1 ],
  [ -98,   4,    -55,  1 ],
  [ -73,  -51,   -30,  1 ],
  [ 92,   -90,    1,   1 ],
  [ -54,  -58,    44,  1 ],
  [ 27,    35,   -53,  1 ],
  [ -68,   72,   -86,  1 ],
];

const nbIterations = 1000000;

for (let i = 0; i < QUADRUP_TWO_COEFFS.length; i++) {
  const coeffs = QUADRUP_TWO_COEFFS[i];
  const attractor = makeQuadrupTwo(coeffs[0], coeffs[1], coeffs[2]);

  let initialPointPicker = () => complex(0, 0);
  if (coeffs[3] > 1) {
    initialPointPicker = randomComplex;
  }

  setRandomSeed('dioptase');

  // we compute automatically the domain of the attractor
  const domain = scaleDomain(estimateAttractorDomain(attractor, () => complex(0, 0), makeIdentity(), 1000000), 1.2);
  console.log('Estimated domain', domain);

  // we create a color function that will apply the palette depending on the location of the point and the number of iterations
  const colorFunc = makeMixedColorSteal(CATERPILLAR, domain.xmax / 2, nbIterations, 0.5, 0.5);

  // and we plot
  plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/quadrup-two${i + 1}.png`, 2048, 2048, attractor, initialPointPicker, colorFunc, coeffs[3], nbIterations, domain);
}
