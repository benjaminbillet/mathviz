import { makeIdentity, makeIteratedMandelbrotFunction } from '../../transform';
import { mkdirs } from '../../utils/fs';
import { plotIfs } from '../util';
import { makeHeighwayDragonIfs, HEIGHWAY_DRAGON_DOMAIN, GOLDEN_DRAGON_DOMAIN, FUDGEFLAKE_DOMAIN, TERDRAGON_DOMAIN, TWIN_DRAGON_DOMAIN, makeTwinDragonIfs, makeTerdragonIfs, makeFudgeFlake, makeGoldenDragonIfs } from '../../ifs/heighway-dragon';
import affine from '../../utils/affine';
import { compose2dRandomizedFunctions, compose2dFunctions } from '../../utils/misc';
import { TWONDRAGON_DOMAIN, makeTwondragon } from '../../ifs/twondragon';
import { scaleDomain } from '../../utils/domain';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/ifs`;
mkdirs(OUTPUT_DIRECTORY);

// the number of points is high, it can take a lot of time to get a picture
plotIfs(`${OUTPUT_DIRECTORY}/heighway-dragon.png`, 2048, 2048, makeHeighwayDragonIfs(), 10000, 10000, makeIdentity(), HEIGHWAY_DRAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/twin-dragon.png`, 2048, 2048, makeTwinDragonIfs(), 10000, 10000, makeIdentity(), TWIN_DRAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/terdragon.png`, 2048, 2048, makeTerdragonIfs(), 10000, 10000, makeIdentity(), TERDRAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/fudgeflake.png`, 2048, 2048, makeFudgeFlake(), 10000, 10000, makeIdentity(), FUDGEFLAKE_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/golden-dragon.png`, 2048, 2048, makeGoldenDragonIfs(), 10000, 10000, makeIdentity(), GOLDEN_DRAGON_DOMAIN);

for (let i = 2; i <= 5; i++) {
  plotIfs(`${OUTPUT_DIRECTORY}/twondragon-s=${i}.png`, 2048, 2048, makeTwondragon(i), 10000, 10000, makeIdentity(), TWONDRAGON_DOMAIN);
}
plotIfs(`${OUTPUT_DIRECTORY}/twondragon-mandelbrot4-s=3.png`, 2048, 2048, makeTwondragon(3), 10000, 10000, makeIteratedMandelbrotFunction(4, 5), scaleDomain(TWONDRAGON_DOMAIN, 0.5));


// compose 4 rotations into a single transformation
// TODO it would be better to create a "plotter" function and pass it to all plot function
// (the plotter would then plot one point for each transformation, making it a kind of multispace plotter)
const MULTIDRAGON_DOMAIN = { xmin: -7/6, xmax: 7/6, ymin: -7/6, ymax: 7/6 };
const rotate0 = affine.makeAffine2dFromMatrix(affine.rotate(0));
const rotate90 = affine.makeAffine2dFromMatrix(affine.rotate(Math.PI * 0.5));
const rotate180 = affine.makeAffine2dFromMatrix(affine.rotate(Math.PI));
const rotate270 = affine.makeAffine2dFromMatrix(affine.rotate(Math.PI * 1.5));
const finalTransform = compose2dRandomizedFunctions([ rotate0, rotate90, rotate180, rotate270 ]);

plotIfs(`${OUTPUT_DIRECTORY}/heighway-multidragon.png`, 2048, 2048, makeHeighwayDragonIfs(), 10000, 10000, finalTransform, MULTIDRAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/golden-multidragon.png`, 2048, 2048, makeGoldenDragonIfs(), 10000, 10000, finalTransform, MULTIDRAGON_DOMAIN);

// we can also compose the 4 randomly-picked rotations with another final transformation
plotIfs(`${OUTPUT_DIRECTORY}/golden-multidragon-mandelbrot2.png`, 2048, 2048, makeGoldenDragonIfs(), 10000, 10000, compose2dFunctions(finalTransform, makeIteratedMandelbrotFunction(2, 5)), MULTIDRAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/golden-multidragon-mandelbrot3.png`, 2048, 2048, makeGoldenDragonIfs(), 10000, 10000, compose2dFunctions(finalTransform, makeIteratedMandelbrotFunction(3, 5)), MULTIDRAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/golden-multidragon-mandelbrot4.png`, 2048, 2048, makeGoldenDragonIfs(), 10000, 10000, compose2dFunctions(finalTransform, makeIteratedMandelbrotFunction(4, 5)), MULTIDRAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/golden-multidragon-mandelbrot5.png`, 2048, 2048, makeGoldenDragonIfs(), 10000, 10000, compose2dFunctions(finalTransform, makeIteratedMandelbrotFunction(5, 5)), MULTIDRAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/golden-multidragon-mandelbrot6.png`, 2048, 2048, makeGoldenDragonIfs(), 10000, 10000, compose2dFunctions(finalTransform, makeIteratedMandelbrotFunction(6, 5)), MULTIDRAGON_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/golden-multidragon-mandelbrot7.png`, 2048, 2048, makeGoldenDragonIfs(), 10000, 10000, compose2dFunctions(finalTransform, makeIteratedMandelbrotFunction(7, 5)), MULTIDRAGON_DOMAIN);
