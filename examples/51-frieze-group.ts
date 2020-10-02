import { add, complex, conjugate, mul, powN } from '../utils/complex';

import { BI_UNIT_DOMAIN, scaleDomain } from '../utils/domain';
import { mkdirs } from '../utils/fs';
import { ComplexToComplexFunction } from '../utils/types';
import { randomComplex, setRandomSeed } from '../utils/random';
import { plotDomainColoring } from './util';
import { makeP1M1FriezeFunction, makeP111FriezeFunction, makeP211FriezeFunction, makeP11MFriezeFunction, makeP11GFriezeFunction, makeP2MMFriezeFunction, makeP2MGFriezeFunction } from '../symmetry/frieze-group';

const OUTPUT_DIRECTORY = `${__dirname}/../output/frieze`;
mkdirs(OUTPUT_DIRECTORY);

const domain = BI_UNIT_DOMAIN;

setRandomSeed(100);

const p111 = makeP111FriezeFunction(5, [5, 6, 4], [complex(1, 0), randomComplex(0, 0.25, 0, 0.25), randomComplex(0, 0.25, 0, 0.25)], [1, 1, 2]);
const p1m1 = makeP1M1FriezeFunction(5, [5, 6, 4], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 1, 2]);
const p211 = makeP211FriezeFunction(5, [3, -1, 5], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 1, 1]);
const p11m = makeP11MFriezeFunction(5, [2, 8, 4], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 2, 1]);
const p11g = makeP11GFriezeFunction(5, [2, 8, 4], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 2, 2]);
const p2mm = makeP2MMFriezeFunction(5, [2, 6, 11], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 1, 2]);
const p2mg = makeP2MGFriezeFunction(5, [1, 3, 2], [complex(1, 0), randomComplex(0, 0.1, 0, 0.1), randomComplex(0, 0.1, 0, 0.1)], [1, 1, 2]);

plotDomainColoring(`${OUTPUT_DIRECTORY}/frieze-p111.png`, `${__dirname}/vegetables.png`, p111, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/frieze-p1m1.png`, `${__dirname}/vegetables.png`, p1m1, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/frieze-p211.png`, `${__dirname}/vegetables.png`, p211, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/frieze-p11m.png`, `${__dirname}/vegetables.png`, p11m, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/frieze-p11g.png`, `${__dirname}/vegetables.png`, p11g, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/frieze-p2mm.png`, `${__dirname}/vegetables.png`, p2mm, domain);
plotDomainColoring(`${OUTPUT_DIRECTORY}/frieze-p2mg.png`, `${__dirname}/vegetables.png`, p2mg, domain);
