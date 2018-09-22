import { simpleIfsChaosPlot } from '../ifs/chaos-game';
import { createImage, saveImage } from '../utils/picture';
import { makePythagoreanTree } from '../ifs/pythagorean-tree';
import { makeBinaryTree, BINARY_TREE_DOMAIN } from '../ifs/binary-tree';

const plot = async (path, width, height, ifs, domain, iterations) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  simpleIfsChaosPlot(buffer, width, height, ifs, null, domain, iterations);

  await saveImage(image, path);
};

let ifs = makeBinaryTree();
plot('sym-binary-tree.png', 512, 512, ifs, BINARY_TREE_DOMAIN, 1000000);

const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
ifs = makeBinaryTree(Math.PI / 3, 1 / phi);
plot('sym-golden-binary-tree-60.png', 512, 512, ifs, BINARY_TREE_DOMAIN, 1000000);

ifs = makePythagoreanTree(Math.PI/4);
plot('pythagorean-tree-45.png', 512, 512, ifs, { xmin: -3, xmax: 4, ymin: 0, ymax: 7 }, 1000000);

ifs = makePythagoreanTree(Math.PI/6);
plot('pythagorean-tree-30.png', 512, 512, ifs, { xmin: -4, xmax: 3, ymin: -1, ymax: 6 }, 1000000);
