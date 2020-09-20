import { mkdirs } from '../../utils/fs';
import { setRandomSeed } from '../../utils/random';
import { readImage, saveImageBuffer } from '../../utils/picture';
import { applyThreads2, DefaultStrideDistribution, ObedientBehavior, CrosshatchBehavior, ChaoticBehavior, UnrulyBehavior, applyCurlyThreads2 } from '../../effects/threads';
import { convertUnitToRGBA } from '../../utils/color';
import { buildAnimationFromFolder } from '../../utils/mp4';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-effects`;
mkdirs(OUTPUT_DIRECTORY);

const sourcePath = `${__dirname}/../ada-big.png`;

const applyAnimatedThreads = async (animName: string, density = 4, length = 4, period = 1, strideDistribution = DefaultStrideDistribution, behavior = ObedientBehavior) => {
  setRandomSeed(100); // make sure all effects use the same random generation sequence
  const outputPath = `${OUTPUT_DIRECTORY}/${animName}`;
  mkdirs(outputPath);

  const { width, height, buffer } = await readImage(sourcePath, 255);
  applyThreads2(buffer, width, height, density, length, period, strideDistribution, behavior, (buffer, i) => {
    saveImageBuffer(convertUnitToRGBA(buffer), width, height, `${outputPath}/frame-${i}.png`);
  });

  await buildAnimationFromFolder(outputPath, `${OUTPUT_DIRECTORY}/${animName}.mp4`, 20);
};

const applyAnimatedThreads2 = async (animName: string, density = 4, length = 4, period = 1, strideDistribution = DefaultStrideDistribution) => {
  setRandomSeed(100); // make sure all effects use the same random generation sequence
  const outputPath = `${OUTPUT_DIRECTORY}/${animName}`;
  mkdirs(outputPath);

  const { width, height, buffer } = await readImage(sourcePath, 255);
  applyCurlyThreads2(buffer, width, height, density, length, period, strideDistribution, (buffer, i) => {
    saveImageBuffer(convertUnitToRGBA(buffer), width, height, `${outputPath}/frame-${i}.png`);
  });

  await buildAnimationFromFolder(outputPath, `${OUTPUT_DIRECTORY}/${animName}.mp4`, 20);
};

applyAnimatedThreads('threads-obedient');
applyAnimatedThreads('threads-crosshatch', 4, 4, 1, DefaultStrideDistribution, CrosshatchBehavior);
applyAnimatedThreads('threads-chaotic', 4, 4, 1, DefaultStrideDistribution, ChaoticBehavior);
applyAnimatedThreads('threads-unruly', 4, 4, 1, DefaultStrideDistribution, UnrulyBehavior);
applyAnimatedThreads2('threads-curly');

