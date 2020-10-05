import { BI_UNIT_DOMAIN, scaleDomain } from '../utils/domain';
import { mkdirs } from '../utils/fs';
import { plotDomainReverseColoring } from './util';
import { randomComplex, randomInteger, setRandomSeed } from '../utils/random';
import { makeCMMCMWallpaperFunction, makeCMMP2WallpaperFunction, makeCMP1WallpaperFunction, makeCMPGWallpaperFunction, makeCMPMWallpaperFunction, makeP1P1WallpaperFunction, makeP2P1WallpaperFunction, makeP2P2WallpaperFunction, makeP4GCMMWallpaperFunction, makeP4GPGGWallpaperFunction, makeP4MCMMWallpaperFunction, makeP4MPMMWallpaperFunction, makeP4P2WallpaperFunction, makePGGPGWallpaperFunction, makePGP1WallpaperFunction, makePGPGWallpaperFunction, makePMCMWallpaperFunction, makePMGPGWallpaperFunction, makePMGPMWallpaperFunction, makePMMCMMWallpaperFunction, makePMMPMWallpaperFunction, makePMP1WallpaperFunction, makePMPGWallpaperFunction, makePMPM1WallpaperFunction, makePMPM2WallpaperFunction, makeP4P4WallpaperFunction, makeP4MP4WallpaperFunction, makeP4GP4WallpaperFunction, makeP4MP4MWallpaperFunction, makeP4MP4GWallpaperFunction, saveInvertCollageHorizontal, makePMMP2WallpaperFunction, makePMGP2WallpaperFunction, makePGGP2WallpaperFunction, makePMMPMMWallpaperFunction, makeCMMPMMWallpaperFunction, makePMMPMGWallpaperFunction, makePMGPMGWallpaperFunction, makeCMMPMGWallpaperFunction, makePMGPGGWallpaperFunction, makeCMMPGGWallpaperFunction, makeP6MP6WallpaperFunction, makeP6MP3M1WallpaperFunction, makeP31MP3WallpaperFunction, makeP6P3WallpaperFunction, makeP6P31MWallpaperFunction, makeP3M1P3WallpaperFunction } from '../symmetry/color-reversing-wallpaper-group';


const OUTPUT_DIRECTORY = `${__dirname}/../output/color-reversing-wallpaper`;
mkdirs(OUTPUT_DIRECTORY);

const seed = 94666 //randomInteger(100, 100000);
console.log(seed);
setRandomSeed(94666);

const scale = 2;
const bitmapPath = `${__dirname}/ada-big.png`;

const nbTerms = 3;
const nValues = new Array(nbTerms).fill(null).map(() => randomInteger(-3, 7));
const mValues = new Array(nbTerms).fill(null).map(() => randomInteger(-3, 7));
const aValues = new Array(nbTerms).fill(null).map(() => randomComplex(0, 0.2, 0, 0.2));

const nValuesOdd = nValues.map((n, i) => {
  if (n % 2 != 0) {
    return n;
  }
  return n + 1;
});

const mValuesOdd = mValues.map((m, i) => {
  if (m % 2 != 0) {
    return m;
  }
  return m + 1;
});

// ensure n+m values are odd
const nmValuesOdd = nValues.map((n, i) => {
  if ((mValues[i] + n) % 2 != 0) {
    return n;
  }
  return n + 1;
});


saveInvertCollageHorizontal(bitmapPath, `${OUTPUT_DIRECTORY}/color-reverse.png`);

plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p1p1.png`, bitmapPath, makeP1P1WallpaperFunction(1.5, 2.1, nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p2p1.png`, bitmapPath, makeP2P1WallpaperFunction(1.5, 2.1, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p2p2.png`, bitmapPath, makeP2P2WallpaperFunction(1.5, 2.1, nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pgp1.png`, bitmapPath, makePGP1WallpaperFunction(1.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmp1.png`, bitmapPath, makePMP1WallpaperFunction(1.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pgpg.png`, bitmapPath, makePGPGWallpaperFunction(1.8, nValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmpg.png`, bitmapPath, makePMPGWallpaperFunction(1.8, nValues, mValuesOdd, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-cmpg.png`, bitmapPath, makeCMPGWallpaperFunction(1.8, nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmgpg.png`, bitmapPath, makePMGPGWallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pggpg.png`, bitmapPath, makePGGPGWallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmpm1.png`, bitmapPath, makePMPM1WallpaperFunction(0.8, nValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmpm2.png`, bitmapPath, makePMPM2WallpaperFunction(0.8, nValues, mValuesOdd, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-cmpm.png`, bitmapPath, makeCMPMWallpaperFunction(0.8, nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmmpm.png`, bitmapPath, makePMMPMWallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmgpm.png`, bitmapPath, makePMGPMWallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-cmp1.png`, bitmapPath, makeCMP1WallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-cmmp2.png`, bitmapPath, makeCMMP2WallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmcm.png`, bitmapPath, makePMCMWallpaperFunction(0.8, nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-cmmcm.png`, bitmapPath, makeCMMCMWallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmmcmm.png`, bitmapPath, makePMMCMMWallpaperFunction(0.8, nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmmp2.png`, bitmapPath, makePMMP2WallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmgp2.png`, bitmapPath, makePMGP2WallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pggp2.png`, bitmapPath, makePGGP2WallpaperFunction(0.8, nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmmpmm.png`, bitmapPath, makePMMPMMWallpaperFunction(0.8, nValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-cmmpmm.png`, bitmapPath, makeCMMPMMWallpaperFunction(0.8, nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmmpmg.png`, bitmapPath, makePMMPMGWallpaperFunction(0.8, nValues, mValuesOdd, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmgpmg.png`, bitmapPath, makePMGPMGWallpaperFunction(0.8, nValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-cmmpmg.png`, bitmapPath, makeCMMPMGWallpaperFunction(0.8, nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-pmgpgg.png`, bitmapPath, makePMGPGGWallpaperFunction(0.8, nValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-cmmpgg.png`, bitmapPath, makeCMMPGGWallpaperFunction(0.8, nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4p2.png`, bitmapPath, makeP4P2WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4mpmm.png`, bitmapPath, makeP4MPMMWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4gpgg.png`, bitmapPath, makeP4GPGGWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4mcmm.png`, bitmapPath, makeP4MCMMWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4gcmm.png`, bitmapPath, makeP4GCMMWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4p4.png`, bitmapPath, makeP4P4WallpaperFunction(nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4mp4.png`, bitmapPath, makeP4MP4WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4gp4.png`, bitmapPath, makeP4GP4WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4mp4m.png`, bitmapPath, makeP4MP4MWallpaperFunction(nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p4mp4g.png`, bitmapPath, makeP4MP4GWallpaperFunction(nmValuesOdd, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p31mp3.png`, bitmapPath, makeP31MP3WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p3m1p3.png`, bitmapPath, makeP3M1P3WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p6p3.png`, bitmapPath, makeP6P3WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p6p31m.png`, bitmapPath, makeP6P31MWallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p6mp3m1.png`, bitmapPath, makeP6MP3M1WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
plotDomainReverseColoring(`${OUTPUT_DIRECTORY}/wallpaper-p6mp6.png`, bitmapPath, makeP6MP6WallpaperFunction(nValues, mValues, aValues), scaleDomain(BI_UNIT_DOMAIN, scale));
