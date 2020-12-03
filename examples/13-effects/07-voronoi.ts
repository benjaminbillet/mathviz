import { applyVoronoi } from '../../effects/voronoi';
import { mkdirs } from '../../utils/fs';
import { readImage, saveImageBuffer } from '../../utils/picture';
import { setRandomSeed } from '../../utils/random';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const { width, height, buffer } = readImage(`${__dirname}/../ada-big.png`);

setRandomSeed('dioptase');
const voronoi1 = applyVoronoi(buffer, width, height, true)
saveImageBuffer(voronoi1, width, height, `${OUTPUT_DIRECTORY}/voronoi-filled.png`);

setRandomSeed('dioptase');
const voronoi2 = applyVoronoi(buffer, width, height, false, true, true)
saveImageBuffer(voronoi2, width, height, `${OUTPUT_DIRECTORY}/voronoi-wireframe.png`);

setRandomSeed('dioptase');
const voronoi3 = applyVoronoi(buffer, width, height, true, true)
saveImageBuffer(voronoi3, width, height, `${OUTPUT_DIRECTORY}/voronoi-filled-wireframe.png`);
