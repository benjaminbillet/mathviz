import { makeIdentity, makeEpicycloidFunction, makeIteratedMandelbrotFunction, makeExponential } from '../../transform';
import { mkdirs } from '../../utils/fs';
import { plotIfs } from '../util';
import affine from '../../utils/affine';
import { compose2dFunctions } from '../../utils/misc';
import { CULCITA_FERN_DOMAIN, CYCLOSORUS_FERN_DOMAIN, BARNSLEY_FERN_DOMAIN, CULCITA_FERN_COEFFICIENTS, CULCITA_FERN_PROBABILITIES, CYCLOSORUS_FERN_PROBABILITIES, BARNSLEY_FERN_PROBABILITIES, BARNSLEY_FERN_COEFFICIENTS, CYCLOSORUS_FERN_COEFFICIENTS, makeFernIfs } from '../../ifs/barnsley-fern';
import { BI_UNIT_DOMAIN } from '../../utils/domain';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/ifs`;
mkdirs(OUTPUT_DIRECTORY);

// the number of points is high, it can take a lot of time to get a picture
let ifs = makeFernIfs(BARNSLEY_FERN_COEFFICIENTS, BARNSLEY_FERN_PROBABILITIES);
plotIfs(`${OUTPUT_DIRECTORY}/barnsley-fern.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), BARNSLEY_FERN_DOMAIN);

const barnsleyToBiUnitDomain = affine.makeAffine2dFromMatrix(affine.combine(affine.homogeneousScale(1/3), affine.translate(0, -5)));
plotIfs(`${OUTPUT_DIRECTORY}/barnsley-fern-mandelbrot3.png`, 2048, 2048, ifs, 10000, 10000, compose2dFunctions(barnsleyToBiUnitDomain, makeIteratedMandelbrotFunction(3, 5)), BI_UNIT_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/barnsley-fern-mandelbrot7.png`, 2048, 2048, ifs, 10000, 10000, compose2dFunctions(barnsleyToBiUnitDomain, makeIteratedMandelbrotFunction(7, 5)), BI_UNIT_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/barnsley-fern-epicycloid.png`, 2048, 2048, ifs, 10000, 10000, compose2dFunctions(barnsleyToBiUnitDomain, makeEpicycloidFunction(16)), BI_UNIT_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/barnsley-fern-exponential.png`, 2048, 2048, ifs, 10000, 10000, compose2dFunctions(barnsleyToBiUnitDomain, makeExponential()), BI_UNIT_DOMAIN);


ifs = makeFernIfs(CYCLOSORUS_FERN_COEFFICIENTS, CYCLOSORUS_FERN_PROBABILITIES);
plotIfs(`${OUTPUT_DIRECTORY}/cyclosorus-fern.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), CYCLOSORUS_FERN_DOMAIN);

ifs = makeFernIfs(CULCITA_FERN_COEFFICIENTS, CULCITA_FERN_PROBABILITIES);
plotIfs(`${OUTPUT_DIRECTORY}/culcita-fern.png`, 2048, 2048, ifs, 10000, 10000, makeIdentity(), CULCITA_FERN_DOMAIN);
