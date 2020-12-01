import { makeKochFlakeIfs, makeKochCurveIfs, makeFlowsnakeIfs, makeKochAntiFlakeIfs, KOCH_CURVE_DOMAIN, FLOWSNAKE_DOMAIN, KOCH_ANTIFLAKE_DOMAIN } from '../../ifs/koch-curve';
import { makeIdentity, makeEpicycloidFunction, makeHypocycloidFunction, makeIteratedMandelbrotFunction, makePopCornFunction, makeDiamond, makeDiskFunction, makeFanFunction, makeRingsFunction } from '../../transform';
import { mkdirs } from '../../utils/fs';
import { plotIfs } from '../util';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/ifs`;
mkdirs(OUTPUT_DIRECTORY);

// the number of points is high, it can take a lot of time to get a picture
plotIfs(`${OUTPUT_DIRECTORY}/kochflake.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 10000);
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-diamond.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 10000, makeDiamond());
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-disk.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 10000, makeDiskFunction());
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-fan.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 10000, makeFanFunction(0.5, Math.PI * 1.2));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-popcorn.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 10000, makePopCornFunction(-0.15, 0.05));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-rings.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 10000, makeRingsFunction(0.5));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-epicycloid.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 10000, makeEpicycloidFunction(16));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-hypocycloid.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 10000, makeHypocycloidFunction(16));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-mandelbrot2.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 100000, makeIteratedMandelbrotFunction(2, 5));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-mandelbrot3.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 100000, makeIteratedMandelbrotFunction(3, 5));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-mandelbrot4.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 100000, makeIteratedMandelbrotFunction(4, 5));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-mandelbrot5.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 100000, makeIteratedMandelbrotFunction(5, 5));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-mandelbrot6.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 100000, makeIteratedMandelbrotFunction(6, 5));
plotIfs(`${OUTPUT_DIRECTORY}/kochflake-mandelbrot7.png`, 2048, 2048, makeKochFlakeIfs(), 10000, 100000, makeIteratedMandelbrotFunction(7, 5));

plotIfs(`${OUTPUT_DIRECTORY}/kochcurve.png`, 2048, 2048, makeKochCurveIfs(), 10, 10000, makeIdentity(), KOCH_CURVE_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/flowsnake.png`, 2048, 2048, makeFlowsnakeIfs(), 10000, 10000, makeIdentity(), FLOWSNAKE_DOMAIN);
plotIfs(`${OUTPUT_DIRECTORY}/kochantiflake.png`, 2048, 2048, makeKochAntiFlakeIfs(), 100, 10000, makeIdentity(), KOCH_ANTIFLAKE_DOMAIN);
