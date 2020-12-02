import { saveImage, createImage, readImage } from '../utils/picture';
import { mkdirs } from '../utils/fs';
import { ColorHistogram } from '../utils/types';
import { makeHistogram, makeRegionHistogram } from '../utils/histogram';


const OUTPUT_DIRECTORY = `${__dirname}/../output/histogram`;
mkdirs(OUTPUT_DIRECTORY);


const plotHistogram = (histogram: ColorHistogram, name = '') => {
  for (let channel = 0; channel < 3; channel++) {
    const channelHistogram = histogram[channel];
    const max = channelHistogram.reduce((result, current) => Math.max(result, current), Number.MIN_SAFE_INTEGER);

    const width = channelHistogram.length;
    const height = channelHistogram.length;
    const factor = height / max;

    const image = createImage(width, height, 1, 1, 1, 1);
    const { buffer } = image;

    channelHistogram.forEach((amount, binId) => {
      const binHeight = Math.trunc(amount * factor);
      const color = [0, 0, 0, 1];
      color[channel] = binId / channelHistogram.length;
        for (let i = 0; i < binHeight; i++) {
          // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
          const idx = (binId + i * image.width) * 4;
          buffer[idx + 0] = color[0];
          buffer[idx + 1] = color[1];
          buffer[idx + 2] = color[2];
          buffer[idx + 3] = color[3];
      }
    });

    saveImage(image, `${OUTPUT_DIRECTORY}/histogram-${name}-${channel}.png`);
  }
};

const inputPath = `${__dirname}/vegetables.png`;
const inputImage = readImage(inputPath);

plotHistogram(makeHistogram(inputImage.buffer, inputImage.width, inputImage.height), 'vegetables');
plotHistogram(makeRegionHistogram(inputImage.buffer, inputImage.width, inputImage.height, 600, 1200, 1200, 1700), 'vegetables-region');