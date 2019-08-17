import { makeIdentity } from '../transform';
import { mkdirs } from '../utils/fs';
import { plotIfs } from './util';
import { makeBinaryTree, BINARY_TREE_DOMAIN } from '../ifs/binary-tree';
import { makePythagoreanTree } from '../ifs/pythagorean-tree';

const OUTPUT_DIRECTORY = `${__dirname}/../output/ifs`;
mkdirs(OUTPUT_DIRECTORY);

const phi = (1 + Math.sqrt(5)) / 2; // golden ratio

// the number of points is high, it can take a lot of time to get a picture
plotIfs(`${OUTPUT_DIRECTORY}/binary-tree.png`, 2048, 2048, makeBinaryTree(), 10000, 10000, makeIdentity(), BINARY_TREE_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/sym-golden-binary-tree-60.png`, 2048, 2048, makeBinaryTree(Math.PI / 3, 1 / phi), 10000, 10000, makeIdentity(), BINARY_TREE_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/pythagorean-tree-45.png`, 2048, 2048, makePythagoreanTree(Math.PI/4), 10000, 10000, makeIdentity(), { xmin: -3, xmax: 4, ymin: 0, ymax: 7 });
plotIfs(`${OUTPUT_DIRECTORY}/pythagorean-tree-30.png`, 2048, 2048, makePythagoreanTree(Math.PI/6), 10000, 10000, makeIdentity(), { xmin: -4, xmax: 3, ymin: -1, ymax: 6 });
