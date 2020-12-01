import { complex } from '../../utils/complex';
import { BI_UNIT_DOMAIN, scaleDomain } from '../../utils/domain';
import { mkdirs } from '../../utils/fs';
import { randomComplex, setRandomSeed } from '../../utils/random';
import { plotDomainColoring } from '../util';
import { makeP111RosetteFunction, makeP11GRosetteFunction, makeP11MRosetteFunction, makeP1M1RosetteFunction, makeP211RosetteFunction, makeP2MGRosetteFunction, makeP2MMRosetteFunction } from '../../symmetry/rosette-group';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/rosette`;
mkdirs(OUTPUT_DIRECTORY);

const domain = scaleDomain(BI_UNIT_DOMAIN, 2);

setRandomSeed('dioptase');

const p111 = makeP111RosetteFunction(5, [5, 6, 4], [complex(1, 0), randomComplex(0, 0.25, 0, 0.25), randomComplex(0, 0.25, 0, 0.25)], [1, 1, 2]);
const p1m1 = makeP1M1RosetteFunction(5, [5, 6, 4], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 1, 2]);
const p211 = makeP211RosetteFunction(5, [3, -1, 5], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 1, 1]);
const p11m = makeP11MRosetteFunction(5, [2, 8, 4], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 2, 1]);
const p11g = makeP11GRosetteFunction(5, [2, 8, 4], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 2, 2]);
const p2mm = makeP2MMRosetteFunction(5, [2, 6, 11], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 1, 2]);
const p2mg = makeP2MGRosetteFunction(5, [1, 3, 2], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 1, 2]);

plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p111.png`, `${__dirname}/../vegetables.png`, p111, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p1m1.png`, `${__dirname}/../vegetables.png`, p1m1, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p211.png`, `${__dirname}/../vegetables.png`, p211, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p11m.png`, `${__dirname}/../vegetables.png`, p11m, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p11g.png`, `${__dirname}/../vegetables.png`, p11g, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p2mm.png`, `${__dirname}/../vegetables.png`, p2mm, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p2mg.png`, `${__dirname}/../vegetables.png`, p2mg, domain);


const p11g_4fold = makeP11GRosetteFunction(4, [5, 8, 4], [complex(1, 0), randomComplex(0, 0.01, 0, 0.01), randomComplex(0, 0.01, 0, 0.01)], [2, 1, 2]);
const p11g_6fold = makeP11GRosetteFunction(6, [8, 4, 6], [complex(1, 0), randomComplex(0, 0.25, 0, 0.25), randomComplex(0, 0.25, 0, 0.25)], [3, 1, 2]);
const p11g_7fold = makeP11GRosetteFunction(7, [2, 8, 4], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 2, 2]);
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p11g-4fold.png`, `${__dirname}/../vegetables.png`, p11g_4fold, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p11g-6fold.png`, `${__dirname}/../vegetables.png`, p11g_6fold, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p11g-7fold.png`, `${__dirname}/../vegetables.png`, p11g_7fold, domain);

