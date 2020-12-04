import { mkdirs } from '../../utils/fs';
import { setRandomSeed } from '../../utils/random';
import { computeSeparableEtf } from '../../utils/etf';
import { readImage, saveImageBuffer } from '../../utils/picture';
import { applyFbl } from '../../effects/fbl';
import { applyLuminosityPosterize } from '../../effects/posterize';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/npr`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed('dioptase');

const input = readImage(`${__dirname}/../vegetables.png`);
const etf = computeSeparableEtf(input.buffer, input.width, input.height, 3);


let out = applyFbl(input.buffer, input.width, input.height, etf, 20, 100, 20, 100, 3, 3);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/fbl1.png`);

out = applyFbl(input.buffer, input.width, input.height, etf, 40, 200, 40, 200, 5, 3);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/fbl2.png`);

out = applyLuminosityPosterize(out, input.width, input.height, etf, 4);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/fbl3.png`);
