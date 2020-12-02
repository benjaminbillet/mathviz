import { forEachPixel, readImage } from '../../utils/picture';
import { getBrightness, getIntensity, getLightness, getLuminance, getLuminance2, getLuminance3 } from '../../utils/color';
import { mkdirs } from '../../utils/fs';
import { applyPixelARGBSortingBitmap, applyPixelARGBSortingLuminance, applyPixelARGBSortingWhite, applyPixelARGBSortingBlack, SortMode } from '../../effects/pixelsorting';
import { random } from '../../utils/random';
import { plotEffect } from '../util';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const sourcePath = `${__dirname}/../ada-big.png`;


plotEffect(applyPixelARGBSortingBlack, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-black.png`);
plotEffect(applyPixelARGBSortingWhite, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-white.png`);

// different luminance function
plotEffect(applyPixelARGBSortingLuminance, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-lum1.png`, SortMode.SortYX, 60, getLuminance)
plotEffect(applyPixelARGBSortingLuminance, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-lum2.png`, SortMode.SortYX, 60, getLuminance2)
plotEffect(applyPixelARGBSortingLuminance, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-lum3.png`, SortMode.SortYX, 60, getLuminance3)
plotEffect(applyPixelARGBSortingLuminance, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-intensity.png`, SortMode.SortYX, 60, getIntensity)
plotEffect(applyPixelARGBSortingLuminance, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-lightness.png`, SortMode.SortYX, 60, getLightness)
plotEffect(applyPixelARGBSortingLuminance, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-brightness.png`, SortMode.SortYX, 60, getBrightness);

// custom luminance function
plotEffect(applyPixelARGBSortingLuminance, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-lum4.png`, SortMode.SortYX, 60, (r: number, g: number, b: number) => Math.max(r, g, b));

// bitmap based (we generate a random bitmap containing segments)
plotEffect((buffer, width, height) => {
  const bitmap = new Float32Array(width * height);
  let state = 0;
  forEachPixel(buffer, width, height, (r, g, b, a, i, j) => {
    if (random() < 0.05) {
      state = 1 - state;
    }
    bitmap[j + i * height] = state;
  });

  return applyPixelARGBSortingBitmap(buffer, width, height, bitmap, SortMode.SortYX, 0.8);
}, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-bitmap.png`);


// bitmap based (we generate a bitmap from the original image)
plotEffect((buffer, width, height) => {
  const input = readImage(sourcePath);
  const bitmap = new Float32Array(width * height);
  forEachPixel(input.buffer, input.width, input.height, (r, g, b, a, i, j) => {
    let l = getLuminance(r, g, b);
    if (l > 0.4) { // threshold for building the mask
      l = 1;
    } else {
      l = 0;
    }
    bitmap[i + j * width] = l;
  });

  return applyPixelARGBSortingBitmap(buffer, width, height, bitmap, SortMode.SortYX, 0.8);
}, sourcePath, `${OUTPUT_DIRECTORY}/pixelsorting-bitmap2.png`);
