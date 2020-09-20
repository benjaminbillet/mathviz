import { saveImageBuffer, readImage, forEachPixel } from '../utils/picture';
import { convertUnitToRGBA, getLuminance, getLuminance2, getLuminance3 } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { applyPixelARGBSortingBitmap, applyPixelARGBSortingLuminance, applyPixelARGBSortingWhite, applyPixelARGBSortingBlack, SortMode } from '../effects/pixelsorting';
import { random, setRandomSeed } from '../utils/random';
import { Effect } from '../utils/types';


const applyEffect = async (effect: Effect, sourcePath: string, outputPath: string, seed = 10) => {
  setRandomSeed(seed); // make sure all effects use the same random generation sequence
  const { width, height, buffer } = await readImage(sourcePath, 255);
  const output = convertUnitToRGBA(effect(buffer, width, height));
  saveImageBuffer(output, width, height, outputPath);
};

const configureEffect = (effect: Effect, ...args: any[]): Effect => {
  return (input, width, height) => effect(input, width, height, ...args);
};

const OUTPUT_DIRECTORY = `${__dirname}/../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const sourcePath = `${__dirname}/ada-big.png`;


applyEffect(applyPixelARGBSortingBlack, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-black.png`);
applyEffect(applyPixelARGBSortingWhite, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-white.png`);

// different luminance function
applyEffect(configureEffect(applyPixelARGBSortingLuminance, SortMode.SortYX, 60, getLuminance), sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-lum1.png`);
applyEffect(configureEffect(applyPixelARGBSortingLuminance, SortMode.SortYX, 60, getLuminance2), sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-lum2.png`);
applyEffect(configureEffect(applyPixelARGBSortingLuminance, SortMode.SortYX, 60, getLuminance3), sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-lum3.png`);

// custom luminance function
applyEffect(configureEffect(applyPixelARGBSortingLuminance, SortMode.SortYX, 60, (r: number, g: number, b: number) => Math.max(r, g, b)), sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-lum4.png`);

// bitmap based (we generate a random bitmap containing segments)
applyEffect((buffer, width, height) => {
  const bitmap = new Float32Array(width * height);
  let state = 0;
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    if (random() < 0.05) {
      state = 1 - state;
    }
    bitmap[j + i * height] = state;
  });

  return applyPixelARGBSortingBitmap(buffer, width, height, bitmap, SortMode.SortYX, 0.8);
}, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-bitmap.png`);
