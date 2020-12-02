import { mkdirs } from '../../utils/fs';
import { applyThreads, DefaultStrideDistribution, ChaoticBehavior, UnrulyBehavior, CrosshatchBehavior, applyCurlyThreads } from '../../effects/threads';
import { plotEffect } from '../util';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const sourcePath = `${__dirname}/../ada-big.png`;

plotEffect(applyThreads, sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-obedient.png`);
plotEffect(applyThreads, sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-crosshatch.png`, 4, 4, 1, DefaultStrideDistribution, CrosshatchBehavior);
plotEffect(applyThreads, sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-chaotic.png`, 4, 4, 1, DefaultStrideDistribution, ChaoticBehavior);
plotEffect(applyThreads, sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-unruly.png`, 4, 4, 1, DefaultStrideDistribution, UnrulyBehavior);
plotEffect(applyCurlyThreads, sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-curly.png`);
