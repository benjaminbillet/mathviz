import { mkdirs } from '../utils/fs';
import { plotAttractorMultipoint } from './util';
import { makeMixedColorSteal } from '../ifs/fractal-flame';
import { complex } from '../utils/complex';
import { CATERPILLAR } from '../utils/palette';
import { estimateAttractorDomain } from '../attractors/plot';
import { setRandomSeed, randomComplex } from '../utils/random';
import { scaleDomain } from '../utils/domain';
import { makeIdentity } from '../transform';
import { makeHopalong } from '../attractors/hopalong';

const OUTPUT_DIRECTORY = `${__dirname}/../output/attractors`;
mkdirs(OUTPUT_DIRECTORY);

const HOPALONG_COEFFS = [
  [ 2,               -1,                200,              1 ],
  [ -11,              0.05,             0.5,              1 ],
  [ 0.1,              0.1,              20.0,             1 ],
  [ 1.1,              0.5,              1.0,              1 ],
  [ 7.17,             8.44,             2.56,             1 ],
  [ 9.74546888144687, 1.56320227775723, 7.86818214459345, 1 ],
  [ 9.75,             1.56,             7.87,             1 ],
  [ 1.1,              1,                0,                50 ],
  [ -11,              0.05,             20,               20 ],
  [ 2,                0.05,             4,                5 ],
  [ 7.3,              1,                0,                50 ],
];

const nbIterations = 1000000;

for (let i = 0; i < HOPALONG_COEFFS.length; i++) {
  const coeffs = HOPALONG_COEFFS[i];
  const attractor = makeHopalong(coeffs[0], coeffs[1], coeffs[2]);

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
  plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/hopalong${i + 1}.png`, 2048, 2048, attractor, initialPointPicker, colorFunc, coeffs[3], nbIterations, domain);
}
