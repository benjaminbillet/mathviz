import { mkdirs } from '../../utils/fs';
import { getPictureSize, saveImageBuffer } from '../../utils/picture';
import { MANDELBROT_DOMAIN } from '../../fractalsets/mandelbrot';
import { plotBuddhabrot, plotAntiBuddhabrot } from '../../fractalsets/buddhabrot';

// TODO to be refactored and retested, probably not working anymore

const OUTPUT_DIRECTORY = `${__dirname}/../../output/buddhabrot`;
mkdirs(OUTPUT_DIRECTORY);

const size = 2048;


const plot = (path: string, plotFunc, maxIterations = 1000, accuracyFactor = 16, domain = MANDELBROT_DOMAIN) => {
  const [ width, height ] = getPictureSize(size, MANDELBROT_DOMAIN);
  const buffer = plotFunc(width, height, maxIterations, accuracyFactor, domain);
  saveImageBuffer(buffer, width, height, path);
};

plot(`${OUTPUT_DIRECTORY}/buddhabrot.png`, plotBuddhabrot);
plot(`${OUTPUT_DIRECTORY}/anti-buddhabrot.png`, plotAntiBuddhabrot);
