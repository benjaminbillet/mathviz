import { saveImage, createImage } from '../utils/picture';
import { buildColorMap, buildConstrainedColorMap } from '../utils/color';
import { getBigQualitativePalette } from '../utils/palette';
import { mkdirs } from '../utils/fs';


const OUTPUT_DIRECTORY = `${__dirname}/../output/colormap`;
mkdirs(OUTPUT_DIRECTORY);


// a function that plots a colormap into an image
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

  await saveImage(image, `${OUTPUT_DIRECTORY}/colormap-${name}.png`);
};

// a colormap is basically a set of interpolated colors
// the interpolation we use is based on B-spline, which improves the overall "smoothness": https://stackoverflow.com/a/25816111

// black to white interpolation
plotColorMap(buildColorMap([ [ 0, 0, 0 ], [ 255, 255, 255 ] ]), 'bw');

// rainbow
plotColorMap(buildColorMap([ [ 255, 0, 0 ], [ 0, 255, 0 ], [ 0, 0, 255 ] ]), 'rainbow');

// directly from a palette
plotColorMap(buildColorMap(getBigQualitativePalette(10)), 'bigqualitative');

// constrained color maps have fixed distance between palette colors
// here, we still have rainbow, but the red-green interpolation occupies the first 5% of the map and the green-blue interpolation occupies the remaining 95%
plotColorMap(buildConstrainedColorMap([ [ 255, 0, 0 ], [ 0, 255, 0 ], [ 0, 0, 255 ] ], [ 0, 0.05, 1 ]), 'rainbow-deformed');

// our constrained color map builder can take fixed positions, but also functions
const sin4pi = x => 0.5 + 0.5 * Math.sin(x * 4 * Math.PI);
plotColorMap(buildConstrainedColorMap([ [ 255, 0, 0 ], [ 0, 255, 0 ], [ 0, 0, 255 ] ], sin4pi), 'rainbow-deformed-sin');

