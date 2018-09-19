import { saveImage, createImage } from '../utils/picture';
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
} from '../utils/palette';

const plotPalette = async (palette, name = '') => {
  // each color will be represented by a 100x100 square
  const image = createImage(palette.length * 100, 100);
  const buffer = image.getImage().data;

  palette.forEach((color, colorId) => {
    const offsetWidth = colorId * 100;
    for (let i = 0; i < 100; i++) {
      for (let j = 0; j < image.getHeight(); j++) {
        // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
        const idx = (offsetWidth + i + j * image.getWidth()) * 4;
        buffer[idx + 0] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
        buffer[idx + 3] = 255;
      }
    }
  });

  await saveImage(image, `palette-${name}.png`);
};

plotPalette(getTolSequentialPalette(5), 'tol-sequential');
plotPalette(getTolDivergentPalette(5), 'tol-divergent');
plotPalette(getBigQualitativePalette(10), 'bigqualitative');

plotPalette(getTonePalette([ 128, 0, 128 ], 10), 'purple-tone');
plotPalette(getShadePalette([ 128, 0, 128 ], 10), 'purple-shade');
plotPalette(getTintPalette([ 128, 0, 128 ], 10), 'purple-tint');

plotPalette(getAnalogousPalette([ 128, 0, 128 ], 10), 'purple-analogous');
plotPalette(getTriadicColors([ 128, 0, 128 ]), 'purple-triadic');
plotPalette(getTetradicColors([ 128, 0, 128 ]), 'purple-tetradic');
plotPalette(getComplementaryColors([ 128, 0, 128 ]), 'purple-complementary');
plotPalette(getSplitComplementaryColors([ 128, 0, 128 ]), 'purple-split-complementary');

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
