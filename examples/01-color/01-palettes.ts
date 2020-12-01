import { saveImage, createImage, readImage } from '../../utils/picture';
import {
  getTolDivergentPalette,
  getBigQualitativePalette,
  getTolSequentialPalette,
  getAnalogousPalette,
  getTriadicColors,
  getTetradicColors,
  getComplementaryColors,
  getSplitComplementaryColors,
  getShadePalette,
  getTonePalette,
  getTintPalette,
  FIRE,
  BOAT,
  ICE,
  PURPLE_MAGIC,
  FOREST,
  MUD,
  WATERMELON,
  SEA_FIRE,
  RUBY,
  CATERPILLAR,
  MAVERICK,
  OPAL,
  AUTUMN,
  WOOD,
  BLUE_MOON,
  SIERRA,
  SKY,
} from '../../utils/palette';
import { mkdirs } from '../../utils/fs';
import { Palette } from '../../utils/types';
import { extractPalette } from '../../utils/palette-extraction';
import { setRandomSeed } from '../../utils/random';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/palette`;
mkdirs(OUTPUT_DIRECTORY);


// a function that plots a palette into an image
const plotPalette = (palette: Palette, name = '') => {
  // each color will be represented by a 100x100 square
  const image = createImage(palette.length * 100, 100);
  const buffer = image.buffer;

  palette.forEach((color, colorId) => {
    const offsetWidth = colorId * 100;
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < image.height; j++) {
        // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
        const idx = (offsetWidth + i + j * image.width) * 4;
        buffer[idx + 0] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
        buffer[idx + 3] = color[3];
      }
    }
  });

  saveImage(image, `${OUTPUT_DIRECTORY}/palette-${name}.png`);
};

// given one color, we can build palettes based on color properties (complementary, shades, tints, etc.)
plotPalette(getTonePalette([ 0.5, 0, 0.5, 1 ], 10), 'purple-tone');
plotPalette(getShadePalette([ 0.5, 0, 0.5, 1 ], 10), 'purple-shade');
plotPalette(getTintPalette([ 0.5, 0, 0.5, 1 ], 10), 'purple-tint');

plotPalette(getAnalogousPalette([ 0.5, 0, 0.5, 1 ], 10), 'purple-analogous');
plotPalette(getTriadicColors([ 0.5, 0, 0.5, 1 ]), 'purple-triadic');
plotPalette(getTetradicColors([ 0.5, 0, 0.5, 1 ]), 'purple-tetradic');
plotPalette(getComplementaryColors([ 0.5, 0, 0.5, 1 ]), 'purple-complementary');
plotPalette(getSplitComplementaryColors([ 0.5, 0, 0.5, 1 ]), 'purple-split-complementary');

// some custom fixed-size palettes
plotPalette(FIRE, 'fire');
plotPalette(BOAT, 'boat');
plotPalette(ICE, 'ice');
plotPalette(PURPLE_MAGIC, 'purple-magic');
plotPalette(FOREST, 'forest');
plotPalette(MUD, 'mud');
plotPalette(WATERMELON, 'watermelon');
plotPalette(SEA_FIRE, 'seafire');
plotPalette(RUBY, 'ruby');
plotPalette(CATERPILLAR, 'caterpillar');
plotPalette(MAVERICK, 'maverick');
plotPalette(OPAL, 'opal');
plotPalette(AUTUMN, 'autumn');
plotPalette(WOOD, 'wood');
plotPalette(BLUE_MOON, 'bluemoon');
plotPalette(SIERRA, 'sierra');
plotPalette(SKY, 'sky');

// some custom extensible palettes
plotPalette(getTolSequentialPalette(5), 'tol-sequential');
plotPalette(getTolDivergentPalette(5), 'tol-divergent');
plotPalette(getBigQualitativePalette(10), 'bigqualitative');

// palette extraction from an image
const plotPicturePalette = (inputPath: string, name = '') => {
  // load the image and extract palette
  const inputImage = readImage(inputPath);
  const palette = extractPalette(inputImage.buffer, inputImage.width, inputImage.height, 10);
  plotPalette(palette, name);
};

setRandomSeed('dioptase');
plotPicturePalette(`${__dirname}/../vegetables.png`, 'extracted-10');
