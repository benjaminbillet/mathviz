import { mkdirs } from '../../utils/fs';
import { setRandomSeed } from '../../utils/random';
import { computeSeparableEtf } from '../../utils/etf';
import { fillPicture, readImage, saveImageBuffer } from '../../utils/picture';
import { applyFbl } from '../../effects/fbl';
import { applyLuminosityPosterize } from '../../effects/posterize';
import { applyFdog } from '../../effects/fdog';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/npr`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed('dioptase');

const input = readImage(`${__dirname}/../vegetables.png`);
const etf = computeSeparableEtf(input.buffer, input.width, input.height, 3);

const fdog = applyFdog(input.buffer, input.width, input.height, etf, 3, 0.9, 0.999, 3, 3, 0.997, 3);
const fbl = applyFbl(input.buffer, input.width, input.height, etf, 20, 100, 20, 100, 7, 3);
const fblPosterized = applyLuminosityPosterize(fbl, input.width, input.height, 4, 5);

const combined = fillPicture(new Float32Array(input.width * input.height * 4), 0, 0, 0, 1);
for (let i = 0; i < input.width; i++) {
  for (let j = 0; j < input.height; j++) {
    const idx = (i + j * input.width) * 4;
    combined[idx + 0] = Math.min(fdog[idx + 0], fblPosterized[idx + 0]);
    combined[idx + 1] = Math.min(fdog[idx + 1], fblPosterized[idx + 1]);
    combined[idx + 2] = Math.min(fdog[idx + 2], fblPosterized[idx + 2]);
  }
}

saveImageBuffer(combined, input.width, input.height, `${OUTPUT_DIRECTORY}/fbl-fdog.png`);

