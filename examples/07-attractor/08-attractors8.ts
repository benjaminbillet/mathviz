import { mkdirs } from '../../utils/fs';
import { plotAttractorMultipoint, plotAutoscaledAttractor } from '../util';
import { makeIterationColorSteal } from '../../ifs/fractal-flame';
import { complex } from '../../utils/complex';
import { MAVERICK } from '../../utils/palette';
import { setRandomSeed, randomComplex } from '../../utils/random';
import { scaleDomain, BI_UNIT_DOMAIN } from '../../utils/domain';
import { makePopcorn } from '../../attractors/popcorn';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/attractors`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed('dioptase');

const nbIterations = 1000000;
const initialPointPicker = () => complex(0.5, 1);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/popcorn1.png`, 2048, 2048, makePopcorn(0.05), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/popcorn2.png`, 2048, 2048, makePopcorn(0.06), initialPointPicker, MAVERICK, nbIterations, nbIterations);


const nbPoints2 = 1000000;
const nbIterations2 = 500;
const colorFunc2 = makeIterationColorSteal(MAVERICK, nbIterations2);
const initialPointPicker2 = randomComplex;
plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/popcorn3.png`, 2048, 2048, makePopcorn(0.01), initialPointPicker2, colorFunc2, nbPoints2, nbIterations2, BI_UNIT_DOMAIN);
plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/popcorn4.png`, 2048, 2048, makePopcorn(0.05), initialPointPicker2, colorFunc2, nbPoints2, nbIterations2, BI_UNIT_DOMAIN);
plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/popcorn5.png`, 2048, 2048, makePopcorn(0.1), initialPointPicker2, colorFunc2, nbPoints2, nbIterations2, BI_UNIT_DOMAIN);

const nbPoints3 = 1000000;
const nbIterations3 = 500;
const colorFunc3 = makeIterationColorSteal(MAVERICK, nbIterations3);
const initialPointPicker3 = randomComplex;
plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/popcorn6.png`, 2048, 2048, makePopcorn(0.1), initialPointPicker3, colorFunc3, nbPoints3, nbIterations3, scaleDomain(BI_UNIT_DOMAIN, 5));
plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/popcorn7.png`, 2048, 2048, makePopcorn(0.1), initialPointPicker3, colorFunc3, nbPoints3, nbIterations3, scaleDomain(BI_UNIT_DOMAIN, 10));
plotAttractorMultipoint(`${OUTPUT_DIRECTORY}/popcorn8.png`, 2048, 2048, makePopcorn(0.25), initialPointPicker3, colorFunc3, nbPoints3, nbIterations3, scaleDomain(BI_UNIT_DOMAIN, 10));

