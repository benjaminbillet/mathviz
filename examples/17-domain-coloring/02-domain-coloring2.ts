import { ComplexNumber } from '../../utils/complex';

import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { mkdirs } from '../../utils/fs';
import { plotDomainColoring } from '../util';
import { composeWaveFunctions, makeWave, makeMultiwave, makeMultipolar, makeRadialwave } from '../../misc/wave';
import { superellipse } from '../../utils/distance';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/domain-coloring`;
mkdirs(OUTPUT_DIRECTORY);


const w = makeWave(1, Math.PI / 2);
plotDomainColoring(`${OUTPUT_DIRECTORY}/wave1.png`, `${__dirname}/ada-big.png`, (z) => new ComplexNumber(w(z), w(z.reciprocal())), BI_UNIT_DOMAIN);

const w2 = makeMultiwave(7, 4, 0, true);
plotDomainColoring(`${OUTPUT_DIRECTORY}/wave2.png`, `${__dirname}/ada-big.png`, (z) => new ComplexNumber(w2(z), w2(z.reciprocal())), BI_UNIT_DOMAIN);

const w3 = makeMultipolar(20, 4, 0, true);
plotDomainColoring(`${OUTPUT_DIRECTORY}/wave3.png`, `${__dirname}/ada-big.png`, (z) => new ComplexNumber(w3(z), w3(z.reciprocal())), BI_UNIT_DOMAIN);

const w4 = composeWaveFunctions([
  makeMultiwave(7, 4, 0, true),
  makeMultipolar(20, 4, 0, true),
  makeRadialwave(1, 0, superellipse),
]);
plotDomainColoring(`${OUTPUT_DIRECTORY}/wave4.png`, `${__dirname}/ada-big.png`, (z) => new ComplexNumber(w4(z), w4(z.reciprocal())), BI_UNIT_DOMAIN);
