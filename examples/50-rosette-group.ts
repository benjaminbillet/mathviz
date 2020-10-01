import { add, complex, conjugate, mul, powN } from '../utils/complex';

import { BI_UNIT_DOMAIN, scaleDomain } from '../utils/domain';
import { mkdirs } from '../utils/fs';
import { ComplexToComplexFunction } from '../utils/types';
import { randomComplex } from '../utils/random';
import { plotDomainColoring } from './util';
import { makeP111RosetteFunction, makeP11GRosetteFunction, makeP11MRosetteFunction, makeP1M1RosetteFunction, makeP211RosetteFunction, makeP2MGRosetteFunction, makeP2MMRosetteFunction } from '../symmetry/rosette-group';

const OUTPUT_DIRECTORY = `${__dirname}/../output/rosette`;
mkdirs(OUTPUT_DIRECTORY);

const domain = scaleDomain(BI_UNIT_DOMAIN, 1);


const a = randomComplex(0, 0.25, 0, 0.25);
const b = randomComplex(0, 0.25, 0, 0.25);
console.log(a, b);


// { re: -0.3837659158743918, im: -0.18906024750322104 } { re: 0.32088521402329206, im: -0.6847868571057916 }
// { re: 0.23036980396136642, im: 0.7796397330239415 } { re: 0.9152755867689848, im: 0.7731639808043838 }
// { re: 0.8141177599318326, im: 0.5086433412507176 } { re: 0.5423140609636903, im: -0.49555293656885624 }
// { re: 0.6342956623993814, im: 0.06993767502717674 } { re: 0.31277821655385196, im: 0.08440293464809656 }
// { re: 0.9338332188781351, im: 0.03952034655958414 } { re: 0.21910305018536747, im: 0.17324503231793642 }
// { re: 0.9338332188781351, im: 0.03952034655958414 } { re: 0.21910305018536747, im: 0.17324503231793642 }
// { re: 0.19646794587606564, im: 0.16584849613718688 } { re: 0.18630984384799376, im: 0.18020793236792088 }
const f: ComplexToComplexFunction = (z) => {
  const zConjugate = conjugate(z);
  const term1 = powN(z, 5);
  const term2 = powN(zConjugate, 5);
  const term3 = add(mul(zConjugate, powN(z, 6)), mul(z, powN(zConjugate, 6)));
  const term4 = add(mul(powN(z, 4), powN(zConjugate, -6)), mul(powN(z, -6), powN(zConjugate, 4)));

  return add(add(add(term1, term2), mul(term3, a)), mul(term4, b));
};

const p111 = makeP111RosetteFunction(5, [ 5, 6, 4 ], [ complex(1, 0),randomComplex(0, 0.25, 0, 0.25),randomComplex(0, 0.25, 0, 0.25) ], [ 1, 1, 2 ]);
const p1m1 = makeP1M1RosetteFunction(5, [ 5, 6, 4 ], [ complex(1, 0),randomComplex(0, 0.25, 0, 0.25),randomComplex(0, 0.25, 0, 0.25) ], [ 1, 1, 2 ]);
const p211 = makeP211RosetteFunction(5, [ 5, 6, 4 ], [ complex(1, 0),randomComplex(0, 0.1, 0, 0.1),randomComplex(0, 0.1, 0, 0.1) ], [ 1, 1, 2 ]);
const p11m = makeP11MRosetteFunction(5, [ 5, 6, 4 ], [ complex(1, 0),randomComplex(0, 0.1, 0, 0.1),randomComplex(0, 0.1, 0, 0.1) ], [ 1, 1, 2 ]);
const p11g = makeP11GRosetteFunction(5, [ 5, 6, 4 ], [ complex(1, 0),randomComplex(0, 0.1, 0, 0.1),randomComplex(0, 0.1, 0, 0.1) ], [ 1, 1, 2 ]);
const p2mm = makeP2MMRosetteFunction(5, [ 5, 6, 4 ], [ complex(1, 0),randomComplex(0, 0.1, 0, 0.1),randomComplex(0, 0.1, 0, 0.1) ], [ 1, 1, 2 ]);
const p2mg = makeP2MGRosetteFunction(5, [ 5, 6, 4 ], [ complex(1, 0),randomComplex(0, 0.1, 0, 0.1),randomComplex(0, 0.1, 0, 0.1) ], [ 1, 1, 2 ]);

plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p111.png`, `${__dirname}/passiflore.png`, p111, scaleDomain(BI_UNIT_DOMAIN, 2));
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p1m1.png`, `${__dirname}/passiflore.png`, p1m1, scaleDomain(BI_UNIT_DOMAIN, 2));
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p211.png`, `${__dirname}/passiflore.png`, p211, scaleDomain(BI_UNIT_DOMAIN, 2));
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p11m.png`, `${__dirname}/passiflore.png`, p11m, scaleDomain(BI_UNIT_DOMAIN, 2));
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p11g.png`, `${__dirname}/passiflore.png`, p11g, scaleDomain(BI_UNIT_DOMAIN, 2));
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p2mm.png`, `${__dirname}/passiflore.png`, p2mm, scaleDomain(BI_UNIT_DOMAIN, 2));
plotDomainColoring(`${OUTPUT_DIRECTORY}/rosette-p2mg.png`, `${__dirname}/passiflore.png`, p2mg, scaleDomain(BI_UNIT_DOMAIN, 2));
