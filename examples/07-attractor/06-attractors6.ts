import { mkdirs } from '../../utils/fs';
import { plotAttractorMultipoint } from '../util';
import { makeMixedColorSteal } from '../../ifs/fractal-flame';
import { complex } from '../../utils/complex';
import { CATERPILLAR } from '../../utils/palette';
import { estimateAttractorDomain } from '../../attractors/plot';
import { setRandomSeed, randomComplex } from '../../utils/random';
import { scaleDomain } from '../../utils/domain';
import { makeIdentity } from '../../transform';
import { makeThreePly } from '../../attractors/hopalong';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/attractors`;
mkdirs(OUTPUT_DIRECTORY);

const THREE_PLY_COEFFS = [
  [ 55,    -10,    -42.1,    1 ],
  [ -92,   -55,    -35,      1 ],
  [ 62,     69,     41,      1 ],
  [ -29,    61,    -40,      1 ],
  [ 84,     81,     66,      1 ],
  [ -90,    26,     89,      1 ],
  [ -58,   -16,    -83,      1 ],
  [ -67,    43,     46,      1 ],
  [ -79,   -2,     -76,      1 ],
  [ -95,   -5,      81,      1 ],
  [ -91,    20,     77,      1 ],
];

const nbIterations = 1000000;

for (let i = 0; i < THREE_PLY_COEFFS.length; i++) {
  const coeffs = THREE_PLY_COEFFS[i];
  const attractor = makeThreePly(coeffs[0], coeffs[1], coeffs[2]);

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
  plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/three-ply${i + 1}.png`, 2048, 2048, attractor, initialPointPicker, colorFunc, coeffs[3], nbIterations, domain);
}
