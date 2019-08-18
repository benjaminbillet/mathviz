import { readImage, saveImageBuffer, normalizeBuffer } from '../utils/picture';
import { convertUnitToRGBA } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { applyScanlineError } from '../effects/scanlineError';
import { applyComposite } from '../effects/composite';
import { applyCrt } from '../effects/crt';
import { applyDensityMap } from '../effects/densityMap';
import { applyDerivative, applySobelDerivative, applyPrewittDerivative } from '../effects/derivative';
import { applyInterference } from '../effects/interference';
import { applyPosterize } from '../effects/posterize';
import { setRandomSeed, DefaultNormalDistribution } from '../utils/random';
import { applyVhs } from '../effects/vhs';
import { applyVoronoid } from '../effects/voronoid';
import { applyVoroshard } from '../effects/voroshard';
import { applyVortex } from '../effects/vortex';
import { applyWormhole } from '../effects/wormhole';
import { applyThreads, DefaultStrideDistribution, ChaoticBehavior, UnrulyBehavior, CrosshatchBehavior } from '../effects/threads';
import { applyAgate } from '../effects/agate';
import { manhattan2d, akritean2d, makeAkritean2d, makeMinkowski2d, manhattan, makeAkritean, makeMinkowski, euclidean2d } from '../utils/distance';

const applyEffect = async (effect, sourcePath, outputPath) => {
  const image = await readImage(sourcePath);
  const width = image.getWidth();
  const height = image.getHeight();
  let input = image.getImage().data;

  // create a normalized copy of the input image
  input = new Float32Array(input);
  normalizeBuffer(input, width, height);

  const output = convertUnitToRGBA(effect(input, width, height));
  await saveImageBuffer(output, width, height, outputPath);
};

const configureEffect = (effect, ...args) => {
  return (input, width, height) => effect(input, width, height, ...args);
};

const OUTPUT_DIRECTORY = `${__dirname}/../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const sourcePath = `${__dirname}/ada-big.png`;

setRandomSeed(10);


applyEffect(applyScanlineError, sourcePath, `${OUTPUT_DIRECTORY}/effect-scanlineerror.png`);
applyEffect(applyComposite, sourcePath, `${OUTPUT_DIRECTORY}/effect-composite.png`);
applyEffect(applyCrt, sourcePath, `${OUTPUT_DIRECTORY}/effect-crt.png`);
applyEffect(applyDensityMap, sourcePath, `${OUTPUT_DIRECTORY}/effect-densitymap.png`);
applyEffect(applyDerivative, sourcePath, `${OUTPUT_DIRECTORY}/effect-derivative.png`);
applyEffect(applySobelDerivative, sourcePath, `${OUTPUT_DIRECTORY}/effect-sobelderivative.png`);
applyEffect(applyPrewittDerivative, sourcePath, `${OUTPUT_DIRECTORY}/effect-prewittderivative.png`);
applyEffect(applyInterference, sourcePath, `${OUTPUT_DIRECTORY}/effect-interference.png`);
applyEffect(applyVhs, sourcePath, `${OUTPUT_DIRECTORY}/effect-vhs.png`);

applyEffect(configureEffect(applyPosterize, 6), sourcePath, `${OUTPUT_DIRECTORY}/effect-posterize-l=6.png`);
applyEffect(configureEffect(applyPosterize, 3), sourcePath, `${OUTPUT_DIRECTORY}/effect-posterize-l=3.png`);

applyEffect(applyVoronoid, sourcePath, `${OUTPUT_DIRECTORY}/effect-voronoid-euclidean.png`);
applyEffect(configureEffect(applyVoronoid, manhattan2d), sourcePath, `${OUTPUT_DIRECTORY}/effect-voronoid-manhattan.png`);
applyEffect(configureEffect(applyVoronoid, makeAkritean2d(0.5)), sourcePath, `${OUTPUT_DIRECTORY}/effect-voronoid-akritean.png`);
applyEffect(configureEffect(applyVoronoid, makeMinkowski2d(0.5)), sourcePath, `${OUTPUT_DIRECTORY}/effect-voronoid-minkowski.png`);

applyEffect(applyVoroshard, sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-euclidean.png`);
applyEffect(configureEffect(applyVoroshard, 0.2, manhattan2d), sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-manhattan.png`);
applyEffect(configureEffect(applyVoroshard, 0.2, makeAkritean2d(0.5)), sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-akritean.png`);
applyEffect(configureEffect(applyVoroshard, 0.2, makeMinkowski2d(0.5)), sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-minkowski.png`);
applyEffect(configureEffect(applyVoroshard, 0.2, euclidean2d, 0.1), sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-euclidean-d=0.1.png`);

applyEffect(configureEffect(applyVortex, 6), sourcePath, `${OUTPUT_DIRECTORY}/effect-vortex-i=6.png`);
applyEffect(configureEffect(applyVortex, 2000), sourcePath, `${OUTPUT_DIRECTORY}/effect-vortex-i=2000.png`);
applyEffect(applyWormhole, sourcePath, `${OUTPUT_DIRECTORY}/effect-wormhole.png`);

applyEffect(applyThreads, sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-obedient.png`);
applyEffect(configureEffect(applyThreads, 4, 4, 1, DefaultStrideDistribution, CrosshatchBehavior), sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-crosshatch.png`);
applyEffect(configureEffect(applyThreads, 4, 4, 1, DefaultStrideDistribution, ChaoticBehavior), sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-chaotic.png`);
applyEffect(configureEffect(applyThreads, 4, 4, 1, DefaultStrideDistribution, UnrulyBehavior), sourcePath, `${OUTPUT_DIRECTORY}/effect-threads-unruly.png`);

applyEffect(applyAgate, sourcePath, `${OUTPUT_DIRECTORY}/effect-agate-euclidean.png`);
applyEffect(configureEffect(applyAgate, manhattan), sourcePath, `${OUTPUT_DIRECTORY}/effect-agate-manhattan.png`);
applyEffect(configureEffect(applyAgate, makeAkritean(0.5)), sourcePath, `${OUTPUT_DIRECTORY}/effect-agate-akritean.png`);
applyEffect(configureEffect(applyAgate, makeMinkowski(0.7)), sourcePath, `${OUTPUT_DIRECTORY}/effect-agate-minkowski.png`);
