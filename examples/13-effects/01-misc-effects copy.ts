import { saveImageBuffer, readImage } from '../../utils/picture';
import { convertUnitToRGBA } from '../../utils/color';
import { mkdirs } from '../../utils/fs';
import { applyScanlineError } from '../../effects/scanlineError';
import { applyComposite } from '../../effects/composite';
import { applyCrt } from '../../effects/crt';
import { applyDensityMap } from '../../effects/densityMap';
import { applyDerivative, applySobelDerivative, applyPrewittDerivative } from '../../effects/derivative';
import { applyInterference } from '../../effects/interference';
import { applyPosterize } from '../../effects/posterize';
import { setRandomSeed } from '../../utils/random';
import { applyVhs } from '../../effects/vhs';
import { applyVoronoid } from '../../effects/voronoid';
import { applyVoroshard } from '../../effects/voroshard';
import { applyVortex } from '../../effects/vortex';
import { applyWormhole } from '../../effects/wormhole';
import { applyThreads, DefaultStrideDistribution, ChaoticBehavior, UnrulyBehavior, CrosshatchBehavior, applyCurlyThreads } from '../../effects/threads';
import { applyAgate } from '../../effects/agate';
import { manhattan2d, makeAkritean2d, makeMinkowski2d, manhattan, makeAkritean, makeMinkowski, euclidean2d } from '../../utils/distance';
import { applyColorSampling } from '../../effects/colorSampling';
import { applyIcification } from '../../effects/icification';
import { applyGlowingEdges } from '../../effects/glowingEdges';
import { applyBloom } from '../../effects/bloom';
import { applySoup1, applySoup2, applySoup3, applySoup4 } from '../../effects/soup';
import { applyWarp } from '../../effects/warp';
import { applyNormalMap } from '../../effects/normalMap';
import { applyHypersat } from '../../effects/hypersat';
import { applyRasteroid } from '../../effects/rasteroid';
import { Effect } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const sourcePath = `${__dirname}/../ada-big.png`;

/*
applyEffect(configureEffect(applyPosterize, 6), sourcePath, `${OUTPUT_DIRECTORY}/effect-posterize-l=6.png`);
applyEffect(configureEffect(applyPosterize, 3), sourcePath, `${OUTPUT_DIRECTORY}/effect-posterize-l=3.png`);

applyEffect(applyThreads, sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-obedient.png`);
applyEffect(configureEffect(applyThreads, 4, 4, 1, DefaultStrideDistribution, CrosshatchBehavior), sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-crosshatch.png`);
applyEffect(configureEffect(applyThreads, 4, 4, 1, DefaultStrideDistribution, ChaoticBehavior), sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-chaotic.png`);
applyEffect(configureEffect(applyThreads, 4, 4, 1, DefaultStrideDistribution, UnrulyBehavior), sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-unruly.png`);
applyEffect(applyCurlyThreads, sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-curly.png`);
*/