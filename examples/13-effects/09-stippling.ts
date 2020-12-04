import { applyStippling } from '../../effects/stippling';
import { mkdirs } from '../../utils/fs';
import { readImage, saveImageBuffer } from '../../utils/picture';
import { setRandomSeed } from '../../utils/random';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const { width, height, buffer } = readImage(`${__dirname}/../ada-big.png`);

setRandomSeed('dioptase');
const stippling = applyStippling(buffer, width, height, true, false, 3, 10000)
saveImageBuffer(stippling, width, height, `${OUTPUT_DIRECTORY}/stippling.png`);
