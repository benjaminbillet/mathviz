import { makePerlinNoiseFunction } from '../../noise/perlinNoise';
import { plotSupersampledVectorField, plotVectorFieldVectors } from '../util';
import { mkdirs } from '../../utils/fs';
import { complex } from '../../utils/complex';
import { setRandomSeed } from '../../utils/random';
import { getTolDivergentPalette } from '../../utils/palette';
import { mapRange } from '../../utils/misc';
import { VectorFieldColorFunction, VectorFieldFunction } from '../../utils/types';
import { computeSeparableEtf } from '../../utils/etf';
import { mapComplexDomainToPixel, readImage, saveImageBuffer } from '../../utils/picture';
import { BI_UNIT_DOMAIN } from '../../utils/domain';
import { applyLicToNoise, applyLicToPicture } from '../../vector-field/lic';
import { encodeVectorFieldAsImage } from '../../vector-field/vector-field';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/npr`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed('dioptase');

const palette = getTolDivergentPalette(10);

const noise = makePerlinNoiseFunction(1);
const colorfunc: VectorFieldColorFunction = (z, p) => {
  const x = mapRange(noise(p / 1000, 0), -1, 1, 0, 1);
  return palette[Math.trunc(100 * palette.length * x) % palette.length];
};


const input = readImage(`${__dirname}/../vegetables.png`);
const etf = computeSeparableEtf(input.buffer, input.width, input.height, 3);

// a vector function that will return the closest vector in the edge tangent flow
const vectorfunc: VectorFieldFunction = (z) => {
  z = mapComplexDomainToPixel(z, BI_UNIT_DOMAIN, input.width, input.height).trunc();
  const idx = (z.re + z.im * input.width) * 2;
  return complex(etf[idx], etf[idx + 1]);
};

plotSupersampledVectorField(`${OUTPUT_DIRECTORY}/etf1.png`, input.width, input.height, vectorfunc, colorfunc);
plotVectorFieldVectors(`${OUTPUT_DIRECTORY}/etf2.png`, vectorfunc, () => [1, 1, 1, 1], 0, 0);


let out = applyLicToNoise(etf, input.width, input.height)
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/etf3.png`);

out = applyLicToPicture(input.buffer, etf, input.width, input.height, 20);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/etf4.png`);

out = encodeVectorFieldAsImage(etf, input.width, input.height);
saveImageBuffer(out, input.width, input.height, `${OUTPUT_DIRECTORY}/etf5.png`);
