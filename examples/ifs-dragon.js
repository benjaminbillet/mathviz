import { simpleIfsChaosPlot } from '../ifs/chaos-game';
import { GOLDEN_DRAGON_DOMAIN, HEIGHWAY_DRAGON_DOMAIN, makeHeighwayDragonIfs, makeGoldenDragonIfs, makeTwinDragonIfs, TWIN_DRAGON_DOMAIN, makeTerdragonIfs, TERDRAGON_DOMAIN, FUDGEFLAKE_DOMAIN, makeFudgeFlake, Z2_HEIGHWAY_DRAGON_DOMAIN, makeZ2HeighwayDragonIfs } from '../ifs/heighway-dragon';
import { makeAffine2dFromMatrix, rotate, combine } from '../utils/affine';
import { createImage, saveImage } from '../utils/picture';

const plot = async (path, width, height, ifs, domain, iterations) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  simpleIfsChaosPlot(buffer, width, height, ifs, null, domain, iterations);

  await saveImage(image, path);
};


let ifs = makeHeighwayDragonIfs();
plot('heighway-dragon.png', 512, 512, ifs, HEIGHWAY_DRAGON_DOMAIN, 1000000);

ifs = makeTwinDragonIfs();
plot('twin-dragon.png', 512, 512, ifs, TWIN_DRAGON_DOMAIN, 1000000);

ifs = makeTerdragonIfs();
plot('terdragon.png', 512, 512, ifs, TERDRAGON_DOMAIN, 1000000);

ifs = makeFudgeFlake();
plot('fudgeflake.png', 512, 512, ifs, FUDGEFLAKE_DOMAIN, 1000000);

ifs = makeGoldenDragonIfs();
plot('golden-dragon.png', 512, 512, ifs, GOLDEN_DRAGON_DOMAIN, 1000000);





// example of multi-plotting, with 4 rotated dragons

const plot2 = async (path, width, height, ifs, finalTransforms, domain, iterations) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  // we plot all the dragon in the same buffer, one for each defined final transformations
  finalTransforms.forEach(f => simpleIfsChaosPlot(buffer, width, height, ifs, f, domain, iterations));
  
  await saveImage(image, path);
};

ifs = makeHeighwayDragonIfs();
const rotate0 = makeAffine2dFromMatrix(rotate(0));
const rotate90 = makeAffine2dFromMatrix(rotate(Math.PI * 0.5));
const rotate180 = makeAffine2dFromMatrix(rotate(Math.PI));
const rotate270 = makeAffine2dFromMatrix(rotate(Math.PI * 1.5));
plot2('heighway-multidragon.png', 512, 512, ifs, [rotate0, rotate90, rotate180, rotate270], { xmin: -7/6, xmax: 7/6, ymin: -7/6, ymax: 7/6 }, 1000000);

ifs = makeGoldenDragonIfs();
plot2('golden-multidragon.png', 512, 512, ifs, [rotate0, rotate90, rotate180, rotate270], { xmin: -7/6, xmax: 7/6, ymin: -7/6, ymax: 7/6 }, 1000000);
