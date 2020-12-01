import { BI_UNIT_DOMAIN, scaleDomain } from '../../utils/domain';
import { mkdirs } from '../../utils/fs';
import { plotDomainColoring, plotDomainColoring2 } from '../util';
import { randomComplex, randomInteger, setRandomSeed } from '../../utils/random';
import { makeCMMWallpaperFunction, makeCMWallpaperFunction, makeP1WallpaperFunction, makeP2WallpaperFunction, makeP31MWallpaperFunction, makeP3M1WallpaperFunction, makeP3WallpaperFunction, makeP4GWallpaperFunction, makeP4MWallpaperFunction, makeP4WallpaperFunction, makeP6MWallpaperFunction, makeP6WallpaperFunction, makePGGWallpaperFunction, makePGWallpaperFunction, makePMGWallpaperFunction, makePMMWallpaperFunction, makePMWallpaperFunction } from '../../symmetry/wallpaper-group';
import { plotColorWheel1 } from '../../utils/colorwheel';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/wallpaper`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed('dioptase');

const scale = 1;
const bitmapPath = `${__dirname}/../ada-big.png`;

const nbTerms = 3;
const nValues = new Array(nbTerms).fill(null).map(() => randomInteger(0, 10));
const mValues = new Array(nbTerms).fill(null).map(() => randomInteger(0, 10));
const aValues = new Array(nbTerms).fill(null).map(() => randomComplex(0, 0.1, 0, 0.1));

console.log(nValues, mValues, aValues);

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p3.png`, bitmapPath, makeP3WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p6.png`, bitmapPath, makeP6WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p3m1.png`, bitmapPath, makeP3M1WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p31m.png`, bitmapPath, makeP31MWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p6m.png`, bitmapPath, makeP6MWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4.png`, bitmapPath, makeP4WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4m.png`, bitmapPath, makeP4MWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4g.png`, bitmapPath, makeP4GWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p1.png`, bitmapPath, makeP1WallpaperFunction(1.5, 2.1, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-p2.png`, bitmapPath, makeP2WallpaperFunction(1.5, 2.1, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-pm.png`, bitmapPath, makePMWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-pg.png`, bitmapPath, makePGWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmg.png`, bitmapPath, makePMGWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmm.png`, bitmapPath, makePMMWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-pgg.png`, bitmapPath, makePGGWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));


plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p3-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP3WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p6-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP6WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p3m1-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP3M1WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p31m-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP31MWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p6m-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP6MWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p4-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP4WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p4m-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP4MWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p4g-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP4GWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p1-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP1WallpaperFunction(1.5, 2.1, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-p2-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeP2WallpaperFunction(1.5, 2.1, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-pm-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makePMWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-pg-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makePGWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-pmg-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makePMGWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-pmm-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makePMMWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-pgg-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makePGGWallpaperFunction(1.5, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));


// ensure n values are greater or equals to m values
const nValues2 = nValues.map((n, i) => {
  if (mValues[i] > n) {
    return mValues[i] + 1;
  }
  return n;
});

console.log(nValues2, mValues, aValues);
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-cm.png`, bitmapPath, makeCMWallpaperFunction(0.5, nValues2, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-cmm.png`, bitmapPath, makeCMMWallpaperFunction(0.5, nValues2, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));

plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-cm-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeCMWallpaperFunction(0.5, nValues2, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainColoring2(`${OUTPUT_DIRECTORY}/wallpaper-cmm-wheel.png`, plotColorWheel1(1024, 1024), 1024, 1024, makeCMMWallpaperFunction(0.5, nValues2, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
