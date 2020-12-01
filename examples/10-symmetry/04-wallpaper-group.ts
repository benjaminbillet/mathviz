import { eulerComplex } from '../../utils/complex';

import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { TWO_PI } from '../../utils/math';
import { mkdirs } from '../../utils/fs';
import { ComplexToComplexFunction } from '../../utils/types';
import { plotDomainColoring, plotDomainColoring2 } from '../util';
import { plotColorWheel1, plotColorWheel2, plotColorWheel3, plotColorWheel4 } from '../../utils/colorwheel';
import { saveImageBuffer } from '../../utils/picture';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/wallpaper`;
mkdirs(OUTPUT_DIRECTORY);

// a first wallpaper (Creating Symmetry, Frank A. Farris, Chapter 10)

const f: ComplexToComplexFunction = (z) => eulerComplex(TWO_PI * z.im);
const fg1: ComplexToComplexFunction = (z) => z;
const fg2: ComplexToComplexFunction = (z) => z.mul(eulerComplex(TWO_PI / 3));
const fg3: ComplexToComplexFunction = (z) => z.mul(eulerComplex(TWO_PI / 3).powN(2));
const fz: ComplexToComplexFunction = (z) => f(fg1(z)).add(f(fg2(z))).add(f(fg3(z))).div(3);

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-fz.png`, `${__dirname}/../ada-big.png`, fz, BI_UNIT_DOMAIN);

saveImageBuffer(plotColorWheel1(1024, 1024), 1024, 1024,`${OUTPUT_DIRECTORY}/wheel1.png`);
saveImageBuffer(plotColorWheel2(1024, 1024), 1024, 1024,`${OUTPUT_DIRECTORY}/wheel2.png`);
saveImageBuffer(plotColorWheel3(1024, 1024, false), 1024, 1024,`${OUTPUT_DIRECTORY}/wheel3.png`);
saveImageBuffer(plotColorWheel4(1024, 1024), 1024, 1024,`${OUTPUT_DIRECTORY}/wheel4.png`);

plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-fz2-wheel1.png`, plotColorWheel1(1024, 1024), 1024, 1024, fz, BI_UNIT_DOMAIN);
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-fz2-wheel2.png`, plotColorWheel2(1024, 1024), 1024, 1024, fz, BI_UNIT_DOMAIN);
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-fz2-wheel3.png`, plotColorWheel3(1024, 1024, true), 1024, 1024, fz, BI_UNIT_DOMAIN);
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-fz2-wheel4.png`, plotColorWheel4(1024, 1024), 1024, 1024, fz, BI_UNIT_DOMAIN);
