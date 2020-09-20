import { setRandomSeed } from '../utils/random';
import { mkdirs } from '../utils/fs';
import { manhattan, superellipse } from '../utils/distance';
import { plotFunction } from './util';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { BLUE_MOON } from '../utils/palette';
import { makeColorMapFunction, buildColorMap, buildSteppedColorMap } from '../utils/color';
import { composeWaveFunctions, makeWave, makeMultiwave, makePolar, makeMultipolar, makeBiunitColorFunction, makeRadialwave, makeStripped } from '../misc/wave';

const OUTPUT_DIRECTORY = `${__dirname}/../output/waves`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed(100);

const colorizer = makeBiunitColorFunction(makeColorMapFunction(buildColorMap(BLUE_MOON), 255));

plotFunction(`${OUTPUT_DIRECTORY}/wave.png`, 1024, 1024, makeWave(1, Math.PI / 2), BI_UNIT_DOMAIN, colorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/multiwave.png`, 1024, 1024, makeMultiwave(7, 4, 0, true), BI_UNIT_DOMAIN, colorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/polar.png`, 1024, 1024, makePolar(1, 0), BI_UNIT_DOMAIN, colorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/multipolar.png`, 1024, 1024, makeMultipolar(20, 4, 0, true), BI_UNIT_DOMAIN, colorizer, false);

plotFunction(`${OUTPUT_DIRECTORY}/radialwave-euclidean.png`, 1024, 1024, makeRadialwave(1), BI_UNIT_DOMAIN, colorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/radialwave-superellipse.png`, 1024, 1024, makeRadialwave(1, 0, superellipse), BI_UNIT_DOMAIN, colorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/radialwave-manhattan.png`, 1024, 1024, makeRadialwave(1, 0, manhattan), BI_UNIT_DOMAIN, colorizer, false);

plotFunction(`${OUTPUT_DIRECTORY}/wave-stripped.png`, 1024, 1024, makeStripped(makeWave(1, Math.PI / 2)), BI_UNIT_DOMAIN, colorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/multiwave-stripped.png`, 1024, 1024, makeStripped(makeMultiwave(7, 4, 0, true)), BI_UNIT_DOMAIN, colorizer, false);


const stepColorizer = makeBiunitColorFunction(makeColorMapFunction(buildSteppedColorMap([ BLUE_MOON[0], BLUE_MOON[4] ]), 255));

plotFunction(`${OUTPUT_DIRECTORY}/multiwave-step.png`, 1024, 1024, makeMultiwave(7, 4, 0, true), BI_UNIT_DOMAIN, stepColorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/multiwave-stripped-step.png`, 1024, 1024, makeStripped(makeMultiwave(7, 4, 0, true)), BI_UNIT_DOMAIN, stepColorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/multipolar-step.png`, 1024, 1024, makeMultipolar(20, 4, 0, true), BI_UNIT_DOMAIN, stepColorizer, false);

const composed = composeWaveFunctions([
  makeMultiwave(7, 4, 0, true),
  makeMultipolar(20, 4, 0, true),
  makeRadialwave(1, 0, superellipse),
]);

plotFunction(`${OUTPUT_DIRECTORY}/composition.png`, 1024, 1024, composed, BI_UNIT_DOMAIN, colorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/composition-step.png`, 1024, 1024, composed, BI_UNIT_DOMAIN, stepColorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/composition-stripped.png`, 1024, 1024, makeStripped(composed), BI_UNIT_DOMAIN, colorizer, false);
plotFunction(`${OUTPUT_DIRECTORY}/composition-stripped-step.png`, 1024, 1024, makeStripped(composed), BI_UNIT_DOMAIN, stepColorizer, false);


for (let n = 2; n <= 8; n++) {
  for (let w = 1; w <= 6; w++) {
    plotFunction(`${OUTPUT_DIRECTORY}/wave-sine-n=${n}-w=${w}.png`, 1024, 1024, makeStripped(makeMultiwave(7, n, 0, true), w), BI_UNIT_DOMAIN, stepColorizer, false);
  }
}

for (let n = 2; n <= 5; n++) {
  for (let w = 1; w <= 6; w++) {
    plotFunction(`${OUTPUT_DIRECTORY}/polar-sine-n=${n}-w=${w}.png`, 1024, 1024, makeStripped(makeMultipolar(7, n, 0, true), w), BI_UNIT_DOMAIN, stepColorizer, false);
  }
}
