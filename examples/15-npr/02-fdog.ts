import { mkdirs } from '../../utils/fs';
import { setRandomSeed } from '../../utils/random';
import { computeSeparableEtf } from '../../utils/etf';
import { readImage, saveImageBuffer } from '../../utils/picture';
import { applyFdog } from '../../effects/fdog';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/npr`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed('dioptase');

const input = readImage(`${__dirname}/../vegetables.png`);
const etf = computeSeparableEtf(input.buffer, input.width, input.height, 3);

let out = applyFdog(input.buffer, input.width, input.height, etf, 3, 0.8, 0.99, 5, 5, 0.8, 3);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/fdog1.png`);

out = applyFdog(input.buffer, input.width, input.height, etf, 3, 0.8, 1, 3, 3, 0.999, 3);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/fdog2.png`);

out = applyFdog(input.buffer, input.width, input.height, etf, 3, 0.7, 0.99, 3, 3, 0.999, 5);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/fdog3.png`);

out = applyFdog(input.buffer, input.width, input.height, etf, 3, 0.7, 0.99, 7, 7, 0.999, 3);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/fdog4.png`);

out = applyFdog(input.buffer, input.width, input.height, etf, 3, 0.9, 0.999, 3, 3, 0.997, 3);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/fdog5.png`);