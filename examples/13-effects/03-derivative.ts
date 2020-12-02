import { applyDerivative, applyPrewittDerivative, applySobelDerivative } from '../../effects/derivative';
import { mkdirs } from '../../utils/fs';
import { plotEffect } from '../util';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const sourcePath = `${__dirname}/../ada-big.png`;

plotEffect(applyDerivative, sourcePath, `${OUTPUT_DIRECTORY}/effect-derivative.png`);
plotEffect(applySobelDerivative, sourcePath, `${OUTPUT_DIRECTORY}/effect-sobelderivative.png`);
plotEffect(applyPrewittDerivative, sourcePath, `${OUTPUT_DIRECTORY}/effect-prewittderivative.png`);
