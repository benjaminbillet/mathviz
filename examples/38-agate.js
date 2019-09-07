import { randomScalar, setRandomSeed, randomInteger } from '../utils/random';
import { RUBY, FOREST, SKY, BLUE_MOON } from '../utils/palette';
import { mkdirs } from '../utils/fs';
import { makeColormapColorizer, makeTintColorizer, makeShadeColorizer, makeShadeTintColorizer } from '../utils/colorizer';
import { plotAutomata } from './util';
import { generateAgate } from '../automata/agate';

const OUTPUT_DIRECTORY = `${__dirname}/../output/automata`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed(100);

/*
  const makeColorizer = (palette) => {
  let iterations = 0;
  let iterationsPerColor = 0;
  let color = pickRandom(palette);
  let currentColor = D3Color.rgb(...color);
  return () => {
    if (iterations > 0) {
      if (iterationsPerColor > 5 && random() < 0.1) {
        color = pickRandom(palette);
        currentColor = D3Color.rgb(...color);
        iterationsPerColor = 0;
      } else {
        const hsl = D3Color.hsl(currentColor);
        hsl.h = (hsl.h + randomInteger(0, 5)) % 360;
        hsl.s = clamp((hsl.s * 100 - randomInteger(-5, 5)) / 100, 0.25, 0.75);
        hsl.l = clamp((hsl.l * 100 - randomInteger(-10, 10)) / 100, 0.25, 0.75);

        currentColor = D3Color.rgb(hsl);
        iterationsPerColor++;
      }
    }
    iterations++;
    return [ currentColor.r / 255, currentColor.g / 255, currentColor.b / 255 ];
  };
};
*/

const newNucleationProbability = 0.75;
const maxNewNucleationPerIteration = 20;
const nucleationSizeDistribution = () => randomInteger(5, 15);
const nbStartNucleations = 75;
const nbMatrixPoints = 30;
const matrixJitterDistribution = () => randomScalar(0.9, 1.1);
const growDistribution = () => randomInteger(3, 10);

const width = 2048;
const height = 2048;

const colormapColorizer = makeColormapColorizer(BLUE_MOON, 1024);
const tintColorizer = makeTintColorizer(RUBY[2]);
const shadeColorizer = makeShadeColorizer(FOREST[2]);
const shadeTintColorizer = makeShadeTintColorizer(SKY[3]);

plotAutomata(`${OUTPUT_DIRECTORY}/agate-colormap.png`, width, height, () => generateAgate(width, height, nbMatrixPoints, matrixJitterDistribution, nbStartNucleations, nucleationSizeDistribution, newNucleationProbability, maxNewNucleationPerIteration, growDistribution, colormapColorizer));
plotAutomata(`${OUTPUT_DIRECTORY}/agate-tint.png`, width, height, () => generateAgate(width, height, nbMatrixPoints, matrixJitterDistribution, nbStartNucleations, nucleationSizeDistribution, newNucleationProbability, maxNewNucleationPerIteration, growDistribution, tintColorizer));
plotAutomata(`${OUTPUT_DIRECTORY}/agate-shade.png`, width, height, () => generateAgate(width, height, nbMatrixPoints, matrixJitterDistribution, nbStartNucleations, nucleationSizeDistribution, newNucleationProbability, maxNewNucleationPerIteration, growDistribution, shadeColorizer));
plotAutomata(`${OUTPUT_DIRECTORY}/agate-shadetint.png`, width, height, () => generateAgate(width, height, nbMatrixPoints, matrixJitterDistribution, nbStartNucleations, nucleationSizeDistribution, newNucleationProbability, maxNewNucleationPerIteration, growDistribution, shadeTintColorizer));
