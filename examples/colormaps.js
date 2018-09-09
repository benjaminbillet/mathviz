import { saveImage, createImage } from '../utils/picture';
import { buildColorMap, buildConstrainedColorMap } from '../utils/color';
import { getTolDivergentPalette, getBigQualitativePalette, getTolSequentialPalette, getAnalogousPalette, getTriadicColors, getTetradicColors, getComplementaryColors, getSplitComplementaryColors } from '../utils/palette';

const plotColorMap = async (colormap, name = '') => {
  // each color will be represented by a 1x100 vertical line
  const image = createImage(colormap.length, 100);
  const buffer = image.getImage().data;
 
  colormap.forEach((color, i) => {
    for (let j = 0; j < image.getHeight(); j++) {
      // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
      const idx = (i + j * colormap.length) * 4;
      buffer[idx + 0] = color[0];
      buffer[idx + 1] = color[1];
      buffer[idx + 2] = color[2];
      buffer[idx + 3] = 255;
    }
  });

  await saveImage(image, `colormap-${name}.png`);
};

plotColorMap(buildColorMap([[0, 0, 0], [255, 255, 255]]), 'bw');

plotColorMap(buildColorMap([[255, 0, 0], [0, 255, 0], [0, 0, 255]]), 'rainbow');

plotColorMap(buildConstrainedColorMap([[255, 0, 0], [0, 255, 0], [0, 0, 255]], [0, 0.05, 1]), 'rainbow-deformed');

const sin4pi = x => 0.5 + 0.5 * Math.sin(x * 4 * Math.PI);
plotColorMap(buildConstrainedColorMap([[255, 0, 0], [0, 255, 0], [0, 0, 255]], sin4pi), 'rainbow-deformed-sin');


plotColorMap(buildColorMap(getTolSequentialPalette(5)), 'tol-sequential');
plotColorMap(buildColorMap(getTolDivergentPalette(5)), 'tol-divergent');
plotColorMap(buildColorMap(getBigQualitativePalette(10)), 'bigqualitative');

plotColorMap(buildColorMap(getAnalogousPalette([128, 0, 128])), 'purple-analogous');
plotColorMap(buildColorMap(getTriadicColors([128, 0, 128])), 'purple-triadic');
plotColorMap(buildColorMap(getTetradicColors([128, 0, 128])), 'purple-tetradic');
plotColorMap(buildColorMap(getComplementaryColors([128, 0, 128])), 'purple-complementary');
plotColorMap(buildColorMap(getSplitComplementaryColors([128, 0, 128])), 'purple-split-complementary');
