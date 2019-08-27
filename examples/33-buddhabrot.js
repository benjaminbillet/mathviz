import { convertUnitToRGBA } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { getPictureSize, saveImageBuffer } from '../utils/picture';
import { MANDELBROT_DOMAIN } from '../fractalsets/mandelbrot';
import { plotBuddhabrot, plotAntiBuddhabrot } from '../fractalsets/buddhabrot';


const OUTPUT_DIRECTORY = `${__dirname}/../output/buddhabrot`;
mkdirs(OUTPUT_DIRECTORY);

const size = 2048;


const plot = async (path, plotFunc, maxIterations = 1000, accuracyFactor = 16, domain = MANDELBROT_DOMAIN) => {
  const [ width, height ] = getPictureSize(size, MANDELBROT_DOMAIN);
  const buffer = plotFunc(width, height, maxIterations, accuracyFactor, domain);
  await saveImageBuffer(convertUnitToRGBA(buffer), width, height, path);
};

plot(`${OUTPUT_DIRECTORY}/buddhabrot.png`, plotBuddhabrot);
plot(`${OUTPUT_DIRECTORY}/anti-buddhabrot.png`, plotAntiBuddhabrot);
