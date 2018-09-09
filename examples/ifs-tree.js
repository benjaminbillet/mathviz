import { simpleIfsChaosPlot } from '../ifs/chaos-game';
import { createImage, saveImage } from '../utils/picture';
import { makePythagoreanTree, PYTHAGOREAN_TREE_DOMAIN } from '../ifs/pythagorean-tree';
import { makeBinaryTree, BINARY_TREE_DOMAIN } from '../ifs/binary-tree';


const plot = async (path, width, height, ifs, domain, iterations) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  simpleIfsChaosPlot(buffer, width, height, ifs, null, domain, iterations);

  await saveImage(image, path);
};

let ifs = makeBinaryTree();
plot('sym-binary-tree.png', 512, 512, ifs, BINARY_TREE_DOMAIN, 1000000);

ifs = makePythagoreanTree(Math.PI/4);
plot('pythagorean-tree-45.png', 512, 512, ifs, PYTHAGOREAN_TREE_DOMAIN, 1000000);

ifs = makePythagoreanTree(Math.PI/6);
plot('pythagorean-tree-30.png', 512, 512, ifs, PYTHAGOREAN_TREE_DOMAIN, 1000000);
