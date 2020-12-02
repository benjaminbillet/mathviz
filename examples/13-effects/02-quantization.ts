import { mkdirs } from '../../utils/fs';
import { applyLuminosityPosterize, applyMedianCutPosterize, applyPalettePosterize, applyPosterize } from '../../effects/posterize';
import { plotEffect } from '../util';
import { readImage } from '../../utils/picture';
import { extractPalette } from '../../utils/palette-extraction';
import { applyDithering } from '../../effects/dithering';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const sourcePath = `${__dirname}/../ada-big.png`;
// load the image and extract palette
const inputImage = readImage(sourcePath);
const palette5 = extractPalette(inputImage.buffer, inputImage.width, inputImage.height, 5);
const palette15 = extractPalette(inputImage.buffer, inputImage.width, inputImage.height, 10);

plotEffect(applyPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-posterize-l=6.png`, 6);
plotEffect(applyPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-posterize-l=3.png`, 3);

plotEffect(applyPalettePosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-palette-posterize-p=5.png`, palette5);
plotEffect(applyPalettePosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-palette-posterize-p=15.png`, palette15);

plotEffect(applyLuminosityPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-lum-posterize-l=4-phiq=10.png`, 4, 10);
plotEffect(applyLuminosityPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-lum-posterize-l=4-phiq=5.png`, 4, 5);
plotEffect(applyLuminosityPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-lum-posterize-l=4-phiq=2.5.png`, 4, 2.5);
plotEffect(applyLuminosityPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-lum-posterize-l=4-phiq=1.png`, 4, 1);
plotEffect(applyLuminosityPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-lum-posterize-l=4-phiq=0.75.png`, 4, 0.75);
plotEffect(applyLuminosityPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-lum-posterize-l=10-phiq=5.png`, 10, 5);

plotEffect(applyMedianCutPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-mc-posterize-l=8.png`, 8);
plotEffect(applyMedianCutPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-mc-posterize-l=16.png`, 16);
plotEffect(applyMedianCutPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-mc-posterize-l=32.png`, 32);
plotEffect(applyMedianCutPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-mc-posterize-l=64.png`, 64);
plotEffect(applyMedianCutPosterize, sourcePath, `${OUTPUT_DIRECTORY}/effect-mc-posterize-l=128.png`, 128);

plotEffect(applyDithering, sourcePath, `${OUTPUT_DIRECTORY}/effect-dithering-bw.png`, [[0,0,0,1], [1,1,1,1]]);
plotEffect(applyDithering, sourcePath, `${OUTPUT_DIRECTORY}/effect-dithering-palette.png`, palette5);
