import { mkdirs } from '../utils/fs';
import { plotAttractorMultipoint } from './util';
import { makeMixedColorSteal } from '../ifs/fractal-flame';
import { complex } from '../utils/complex';
import { CATERPILLAR } from '../utils/palette';
import { estimateAttractorDomain } from '../attractors/plot';
import { setRandomSeed, randomComplex } from '../utils/random';
import { scaleDomain } from '../utils/domain';
import { makeIdentity } from '../transform';
import { makeChip } from '../attractors/hopalong';

const OUTPUT_DIRECTORY = `${__dirname}/../output/attractors`;
mkdirs(OUTPUT_DIRECTORY);

const CHIP_COEFFS = [
  [ 34,      1,      5,     1 ],
  [ 77,      10,     37,    1 ],
  [ -98,     4,     -55,    1 ],
  [ -73,    -51,    -30,    1 ],
  [ -46,     86,    -29,    1 ],
  [ 73,     -48,     93,    1 ],
  [ -39,     21,    -2,     1 ],
  [ -98,     1,     -17,    1 ],
  [ 2,       74,    -68,    1 ],
  [ -83,     81,    -81,    1 ],
  [ -0.767,  0.084,  0.828, 1 ],
  [ -0.771, -0.331, -0.081, 1 ],
  [ 0.154,   0.072,  0.177, 1 ],
  [ 0.275,  -0.418,  0.235, 1 ],
  [ 0.966,   0.78,   0.426, 1 ],
  [ -0.425,  0.57,   0.147, 1 ],
];

const nbIterations = 1000000;

for (let i = 0; i < CHIP_COEFFS.length; i++) {
  const coeffs = CHIP_COEFFS[i];
  const attractor = makeChip(coeffs[0], coeffs[1], coeffs[2]);

  let initialPointPicker = () => complex(0, 0);
  if (coeffs[3] > 1) {
    initialPointPicker = randomComplex;
  }

  setRandomSeed(100);

  // we compute automatically the domain of the attractor
  const domain = scaleDomain(estimateAttractorDomain(attractor, () => complex(0, 0), makeIdentity(), 1000000), 1.2);
  console.log('Estimated domain', domain);

  // we create a color function that will apply the palette depending on the location of the point and the number of iterations
  const colorFunc = makeMixedColorSteal(CATERPILLAR, domain.xmax / 2, nbIterations, 0.5, 0.5);

  // and we plot
  plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/chip${i + 1}.png`, 2048, 2048, attractor, initialPointPicker, colorFunc, coeffs[3], nbIterations, domain);
}
