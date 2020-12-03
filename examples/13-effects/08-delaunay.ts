import { applyDelaunay } from '../../effects/delaunay';
import { mkdirs } from '../../utils/fs';
import { readImage, saveImageBuffer } from '../../utils/picture';
import { setRandomSeed } from '../../utils/random';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const { width, height, buffer } = readImage(`${__dirname}/../ada-big.png`);

setRandomSeed('dioptase');
const delaunay1 = applyDelaunay(buffer, width, height, true, false)
saveImageBuffer(delaunay1, width, height, `${OUTPUT_DIRECTORY}/delaunay-filled.png`);

setRandomSeed('dioptase');
const delaunay2 = applyDelaunay(buffer, width, height, false, true)
saveImageBuffer(delaunay2, width, height, `${OUTPUT_DIRECTORY}/delaunay-wireframe.png`);

setRandomSeed('dioptase');
const delaunay3 = applyDelaunay(buffer, width, height, true, true)
saveImageBuffer(delaunay3, width, height, `${OUTPUT_DIRECTORY}/delaunay-filled-wireframe.png`);