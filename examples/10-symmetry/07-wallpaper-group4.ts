import { BI_UNIT_DOMAIN, scaleDomain } from '../../utils/domain';
import { mkdirs } from '../../utils/fs';
import { plotDomainColoring, plotDomainReverseColoring } from '../util';
import { randomInteger, randomScalar, setRandomSeed } from '../../utils/random';
import { makeCMMWallpaperFunction, makeP31MWallpaperFunction, makeP3WallpaperFunction, makeP4WallpaperFunction, makeP6WallpaperFunction, makePGWallpaperFunction, makePMMWallpaperFunction } from '../../symmetry/wallpaper-group';
import { ComplexToComplexFunction } from '../../utils/types';
import { eulerComplex } from '../../utils/complex';
import { makeCMPMWallpaperFunction, makeP4GCMMWallpaperFunction, makeCMMPGGWallpaperFunction, makeP6P3WallpaperFunction } from '../../symmetry/color-reversing-wallpaper-group';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/wallpaper`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed('dioptase');

const scale = 3;
const bitmapPath = `${__dirname}/../vegetables.png`;

const nbTerms = 3;
const nValues = new Array(nbTerms).fill(null).map(() => randomInteger(-3, 5));
const mValues = new Array(nbTerms).fill(null).map(() => randomInteger(-3, 5));
const aValues = new Array(nbTerms).fill(null).map(() => eulerComplex(2 * Math.PI * randomScalar(0.5, 2)).mul(0.4));

const nmValuesOdd = nValues.map((n, i) => {
  if ((mValues[i] + n) % 2 != 0) {
    return n;
  }
  return n + 1;
});


console.log(nValues, mValues, aValues);


// interpolate only between 0 and 1, as e^(i * pi) = -1 and e^(0) = 1
const phiInterpolation = (x: number) => {
  if (x < 0.1) {
    return 0;
  } else if (x > 0.9) {
    return 1;
  }
  return (x - 0.1) * 1.25;
};

const makeInterpolation = (f: ComplexToComplexFunction): ComplexToComplexFunction => {
  return (z) => {
    const t = (z.re / scale + 1) / 2;
    const x = phiInterpolation(t);
    return f(z).mul(eulerComplex(Math.PI * x));
  };
};

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-cmm.png`, bitmapPath, makeInterpolation(
  makeCMMWallpaperFunction(0.6, nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-cmm-rev.png`, bitmapPath, makeInterpolation(
  makeCMMWallpaperFunction(0.6, nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p31m.png`, bitmapPath, makeInterpolation(
  makeP31MWallpaperFunction(nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p31m-rev.png`, bitmapPath, makeInterpolation(
  makeP31MWallpaperFunction(nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-pmm.png`, bitmapPath, makeInterpolation(
  makePMMWallpaperFunction(1.2, nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-pmm-rev.png`, bitmapPath, makeInterpolation(
  makePMMWallpaperFunction(1.2, nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-pg.png`, bitmapPath, makeInterpolation(
  makePGWallpaperFunction(1.2, nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-pg-rev.png`, bitmapPath, makeInterpolation(
  makePGWallpaperFunction(1.2, nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p3.png`, bitmapPath, makeInterpolation(
  makeP3WallpaperFunction(nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p3-rev.png`, bitmapPath, makeInterpolation(
  makeP3WallpaperFunction(nValues, mValues, aValues), 
), scaleDomain(BI_UNIT_DOMAIN, scale), false);

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p4.png`, bitmapPath, makeInterpolation(
  makeP4WallpaperFunction(nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p4-rev.png`, bitmapPath, makeInterpolation(
  makeP4WallpaperFunction(nValues, mValues, aValues), 
), scaleDomain(BI_UNIT_DOMAIN, scale), false);

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p6.png`, bitmapPath, makeInterpolation(
  makeP6WallpaperFunction(nValues, mValues, aValues), 
), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p6-rev.png`, bitmapPath, makeInterpolation(
  makeP6WallpaperFunction(nValues, mValues, aValues), 
), scaleDomain(BI_UNIT_DOMAIN, scale), false);

plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-cmpm.png`, bitmapPath, makeInterpolation(
  makeCMPMWallpaperFunction(1.4, nmValuesOdd, mValues, aValues),
), scaleDomain(BI_UNIT_DOMAIN, scale));


const makeInterpolation2 = (f1: ComplexToComplexFunction, f2: ComplexToComplexFunction): ComplexToComplexFunction => {
  return (z) => { 
    const t = (z.re / scale + 1) / 2;
    const x = phiInterpolation(t);
    return f1(z).mul(1 - x).add(f2(z).mul(x))
  };
};


plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p3-p6.png`, bitmapPath, makeInterpolation2(
  makeP3WallpaperFunction(nValues, mValues, aValues),
  makeP6WallpaperFunction(nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p3-p6-rev.png`, bitmapPath, makeInterpolation2(
  makeP3WallpaperFunction(nValues, mValues, aValues),
  makeP6WallpaperFunction(nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));

plotDomainColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p4-p6.png`, bitmapPath, makeInterpolation2(
  makeP4WallpaperFunction(nValues, mValues, aValues),
  makeP6WallpaperFunction(nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p4-p6-rev.png`, bitmapPath, makeInterpolation2(
  makeP4WallpaperFunction(nValues, mValues, aValues),
  makeP6WallpaperFunction(nValues, mValues, aValues)
), scaleDomain(BI_UNIT_DOMAIN, scale));

plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-cmpm-p4.png`, bitmapPath, makeInterpolation2(
  makeCMPMWallpaperFunction(1.4, nmValuesOdd, mValues, aValues),
  makeP4WallpaperFunction(nValues, mValues, aValues),
), scaleDomain(BI_UNIT_DOMAIN, scale));

plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-p4gcmm-p3.png`, bitmapPath, makeInterpolation2(
  makeP4GCMMWallpaperFunction(nValues, mValues, aValues),
  makeP3WallpaperFunction(nValues, mValues, aValues),
), scaleDomain(BI_UNIT_DOMAIN, scale));

plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-lerp-cmmpgg-p6p3.png`, bitmapPath, makeInterpolation2(
  makeCMMPGGWallpaperFunction(1.8, nmValuesOdd, mValues, aValues),
  makeP6P3WallpaperFunction(nValues, mValues, aValues),
), scaleDomain(BI_UNIT_DOMAIN, scale));