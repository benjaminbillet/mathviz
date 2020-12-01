import { makeIdentity, makeIteratedMandelbrotFunction } from '../../transform';
import { mkdirs } from '../../utils/fs';
import { plotIfs } from '../util';
import * as affine from '../../utils/affine';
import { compose2dFunctions } from '../../utils/misc';
import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { makeDragon1, DRAGON1_DOMAIN, makeDragon2, makeDragon3, makeDragon4, DRAGON2_DOMAIN, DRAGON3_DOMAIN, DRAGON4_DOMAIN } from '../../ifs/misc-dragon';
import { TREE1_DOMAIN, TREE2_DOMAIN, TREE3_DOMAIN, TREE4_DOMAIN, makeTree1, makeTree2, makeTree3, makeTree4 } from '../../ifs/misc-tree';
import { VORTEX1_DOMAIN, VORTEX2_DOMAIN, VORTEX3_DOMAIN, makeVortex1, makeVortex2, makeVortex3 } from '../../ifs/misc-vortex';
import { CORAL1_DOMAIN, makeCoral1 } from '../../ifs/coral';
import { makeMapleLeaf, MAPLE_LEAF_DOMAIN } from '../../ifs/maple-leaf';
import { makeMauldinGasketIfs, MAULDIN_GASKET_DOMAIN } from '../../ifs/mauldin-gasket';
import { APOLLONY_DOMAIN, makeApollonyGasketIfs } from '../../ifs/apollony';
import { makeSierpinskiCarpet, makeSierpinskiNGon, makeSierpinskiPedalTriangle, makeSierpinskiPentagon, makeSierpinskiTriangle, SIERPINSKI_CARPET_DOMAIN, SIERPINSKI_NGON_DOMAIN, SIERPINSKI_PEDAL_TRIANGLE_DOMAIN, SIERPINSKI_PENTAGON_DOMAIN, SIERPINSKI_TRIANGLE_DOMAIN } from '../../ifs/sierpinski';
import { makeMcWorterPentigree, makeMcWorterPentigree2ndForm, makePentadentrite2ndForm, MCWORTER_PENTIGREE_DOMAIN, MCWORTER_PENTIGREE_2NDFORM_DOMAIN, PENTADENDRITE_2NDFORM_DOMAIN } from '../../ifs/mcworter-pentigree';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/ifs`;
mkdirs(OUTPUT_DIRECTORY);

// the number of points is high, it can take a lot of time to get a picture

plotIfs(`${OUTPUT_DIRECTORY}/misc-dragon1.png`, 2048, 2048, makeDragon1(), 10000, 10000, makeIdentity(), DRAGON1_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-dragon2.png`, 2048, 2048, makeDragon2(), 10000, 10000, makeIdentity(), DRAGON2_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-dragon3.png`, 2048, 2048, makeDragon3(), 10000, 10000, makeIdentity(), DRAGON3_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-dragon4.png`, 2048, 2048, makeDragon4(), 10000, 10000, makeIdentity(), DRAGON4_DOMAIN);

const dragon3Zoom = affine.makeAffine2dFromMatrix(affine.combine(affine.homogeneousScale(3), affine.translate(0, 0.25)));
plotIfs(`${OUTPUT_DIRECTORY}/misc-dragon3-mandelbrot3.png`, 2048, 2048, makeDragon3(), 10000, 10000, compose2dFunctions(dragon3Zoom, makeIteratedMandelbrotFunction(3, 5)), DRAGON3_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-dragon3-mandelbrot7.png`, 2048, 2048, makeDragon3(), 10000, 10000, compose2dFunctions(dragon3Zoom, makeIteratedMandelbrotFunction(7, 5)), DRAGON3_DOMAIN);


plotIfs(`${OUTPUT_DIRECTORY}/misc-tree1.png`, 2048, 2048, makeTree1(), 10000, 10000, makeIdentity(), TREE1_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-tree2.png`, 2048, 2048, makeTree2(), 10000, 10000, makeIdentity(), TREE2_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-tree3.png`, 2048, 2048, makeTree3(), 10000, 10000, makeIdentity(), TREE3_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-tree4.png`, 2048, 2048, makeTree4(), 10000, 10000, makeIdentity(), TREE4_DOMAIN);

const tree4Zoom = affine.makeAffine2dFromMatrix(affine.combine(affine.homogeneousScale(4), affine.translate(0, -0.15)));
plotIfs(`${OUTPUT_DIRECTORY}/misc-tree4-mandelbrot5.png`, 2048, 2048, makeTree4(), 10000, 10000, compose2dFunctions(tree4Zoom, makeIteratedMandelbrotFunction(5, 5)), BI_UNIT_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-tree4-mandelbrot6.png`, 2048, 2048, makeTree4(), 10000, 10000, compose2dFunctions(tree4Zoom, makeIteratedMandelbrotFunction(6, 5)), BI_UNIT_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-tree4-mandelbrot7.png`, 2048, 2048, makeTree4(), 10000, 10000, compose2dFunctions(tree4Zoom, makeIteratedMandelbrotFunction(7, 5)), BI_UNIT_DOMAIN);


plotIfs(`${OUTPUT_DIRECTORY}/misc-vortex1.png`, 2048, 2048, makeVortex1(), 10000, 10000, makeIdentity(), VORTEX1_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-vortex2.png`, 2048, 2048, makeVortex2(), 10000, 10000, makeIdentity(), VORTEX2_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-vortex3.png`, 2048, 2048, makeVortex3(), 10000, 10000, makeIdentity(), VORTEX3_DOMAIN);

plotIfs(`${OUTPUT_DIRECTORY}/misc-vortex3-mandelbrot3.png`, 2048, 2048, makeVortex3(), 10000, 10000, makeIteratedMandelbrotFunction(3, 5), VORTEX3_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-vortex3-mandelbrot5.png`, 2048, 2048, makeVortex3(), 10000, 10000, makeIteratedMandelbrotFunction(5, 5), VORTEX3_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-vortex3-mandelbrot6.png`, 2048, 2048, makeVortex3(), 10000, 10000, makeIteratedMandelbrotFunction(6, 5), VORTEX3_DOMAIN);


plotIfs(`${OUTPUT_DIRECTORY}/misc-coral.png`, 2048, 2048, makeCoral1(), 10000, 10000, makeIdentity(), CORAL1_DOMAIN);


plotIfs(`${OUTPUT_DIRECTORY}/misc-maple-leaf.png`, 2048, 2048, makeMapleLeaf(), 10000, 10000, makeIdentity(), MAPLE_LEAF_DOMAIN);


plotIfs(`${OUTPUT_DIRECTORY}/misc-mauldin-gasket.png`, 2048, 2048, makeMauldinGasketIfs(), 10000, 10000, makeIdentity(), MAULDIN_GASKET_DOMAIN);


plotIfs(`${OUTPUT_DIRECTORY}/misc-apollony-gasket.png`, 2048, 2048, makeApollonyGasketIfs(), 10000, 10000, makeIdentity(), APOLLONY_DOMAIN);


plotIfs(`${OUTPUT_DIRECTORY}/sierpinski-triangle.png`, 2048, 2048, makeSierpinskiTriangle(), 10000, 10000, makeIdentity(), SIERPINSKI_TRIANGLE_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/sierpinski-carpet.png`, 2048, 2048, makeSierpinskiCarpet(), 10000, 10000, makeIdentity(), SIERPINSKI_CARPET_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/sierpinski-pedal.png`, 2048, 2048, makeSierpinskiPedalTriangle(), 10000, 10000, makeIdentity(), SIERPINSKI_PEDAL_TRIANGLE_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/sierpinski-pentagon.png`, 2048, 2048, makeSierpinskiPentagon(), 10000, 10000, makeIdentity(), SIERPINSKI_PENTAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/sierpinski-6gon.png`, 2048, 2048, makeSierpinskiNGon(6), 10000, 10000, makeIdentity(), SIERPINSKI_NGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/sierpinski-7gon.png`, 2048, 2048, makeSierpinskiNGon(7), 10000, 10000, makeIdentity(), SIERPINSKI_NGON_DOMAIN);


plotIfs(`${OUTPUT_DIRECTORY}/misc-mcworter-pentigree.png`, 2048, 2048, makeMcWorterPentigree(), 10000, 10000, makeIdentity(), MCWORTER_PENTIGREE_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-mcworter-pentigree-2nd-form.png`, 2048, 2048, makeMcWorterPentigree2ndForm(), 10000, 10000, makeIdentity(), MCWORTER_PENTIGREE_2NDFORM_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/misc-pentadendrite.png`, 2048, 2048, makePentadentrite2ndForm(), 10000, 10000, makeIdentity(), PENTADENDRITE_2NDFORM_DOMAIN);
