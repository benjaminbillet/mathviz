import { randomInteger, randomScalar, setRandomSeed } from '../../utils/random';
import { buildAnimationFromFolder } from '../../utils/mp4';
import { makeColormapColorizer, makeTintColorizer, makeShadeColorizer, makeShadeTintColorizer } from '../../utils/colorizer';
import { generateAgate } from '../../automata/agate';
import { mkdirs } from '../../utils/fs';
import { RUBY, FOREST, SKY, BLUE_MOON } from '../../utils/palette';
import { IterableColorFunction } from '../../utils/types';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-automata`;
mkdirs(OUTPUT_DIRECTORY);


const newNucleationProbability = 0.75;
const maxNewNucleationPerIteration = 20;
const nucleationSizeDistribution = () => randomInteger(5, 15);
const nbStartNucleations = 75;
const nbMatrixPoints = 30;
const matrixJitterDistribution = () => randomScalar(0.9, 1.1);
const growDistribution = () => randomInteger(3, 10);

const width = 2048;
const height = 2048;

const animateAgate = async (animName: string, colorizer: IterableColorFunction, seed: number) => {
  setRandomSeed(seed);

  const outputPath = `${OUTPUT_DIRECTORY}/${animName}`;
  mkdirs(outputPath);

  await generateAgate(width, height, nbMatrixPoints, matrixJitterDistribution, nbStartNucleations, nucleationSizeDistribution, newNucleationProbability, maxNewNucleationPerIteration, growDistribution, colorizer, 200, outputPath);
  await buildAnimationFromFolder(outputPath, `${OUTPUT_DIRECTORY}/${animName}.mp4`, 20);
};


const colormapColorizer = makeColormapColorizer(BLUE_MOON, 1024);
const tintColorizer = makeTintColorizer(RUBY[2]);
const shadeColorizer = makeShadeColorizer(FOREST[2]);
const shadeTintColorizer = makeShadeTintColorizer(SKY[3]);

animateAgate('agate-colormap', colormapColorizer, 150);
animateAgate('agate-tint', tintColorizer, 50);
animateAgate('agate-shade', shadeColorizer, 100);
animateAgate('agate-shadetint', shadeTintColorizer, 200);
