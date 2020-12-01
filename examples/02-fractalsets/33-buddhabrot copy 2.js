import { buildConstrainedColorMap, makeColorMapFunction, convertUnitToRGBA, applyContrastBasedScalefactor } from '../../utils/color';
import { mkdirs } from '../../utils/fs';
import { getPictureSize, forEachPixel, mapPixelToDomain, saveImageBuffer, mapDomainToPixel } from '../../utils/picture';
import { complex, powN, add } from '../../utils/complex';
import {  MANDELBROT_DOMAIN } from '../../fractalsets/mandelbrot';
import { makeMixedColorSteal, makeIterationColorSteal } from '../ifs/fractal-flame';
import { CATERPILLAR, OPAL } from '../../utils/palette';
import { isInteresting } from '../../fractalsets/buddhabrot';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/buddhabrot`;
mkdirs(OUTPUT_DIRECTORY);

const colormap = buildConstrainedColorMap(
  [ [ 89, 0, 89 ], [ 255, 235, 255 ], [ 255, 235, 255 ] ],
  [ 0, 0.33, 1 ],
);
const colorfunc = makeColorMapFunction(colormap, 255);


const size = 512;


const plotBuddhabrot = async (path, width, height, domain) => {
  const factor = 8;
  const d = 2;
  const maxIterations = 1000;
  const bailout = 2;
  const squaredBailout = bailout * bailout;
  const iterationsRe = new Float32Array(maxIterations);
  const iterationsIm = new Float32Array(maxIterations);

  let buffer = new Float32Array(width * height * 4).fill(0);

  const halfHeight = Math.ceil(height / 2);
  const maxI = width * factor;
  const maxJ = halfHeight * factor;

  const colorFunc2 = makeMixedColorSteal(CATERPILLAR, domain.xmax, maxIterations, 0.8, 0.2);


  for (let i = 0; i < maxI; i++) {
    for (let j = 0; j < maxJ; j++) {
      const [ x, y ] = mapPixelToDomain(i / factor, j / factor, width, height, domain);
      const u = complex(x, y);
      if (isInteresting(u)) {
        let zn = complex(0, 0);
        let iterations = 0;

        let squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
        while (squaredMagnitude <= squaredBailout && iterations < maxIterations) {
          zn = powN(zn, d, zn);
          zn = add(zn, u, zn);
          iterationsRe[iterations] = zn.re;
          iterationsIm[iterations] = zn.im;
          squaredMagnitude = zn.re*zn.re + zn.im*zn.im;
          iterations++;
        }

        if (iterations < maxIterations) {
          let pixelColor = [ 0, 0, 0 ];
          for (let k = 0; k < iterations; k++) {
            const [ fx, fy ] = mapDomainToPixel(iterationsRe[k], iterationsIm[k], domain, width, height);
            const idx = (fx + fy * width) * 4;
            const color = colorFunc2(iterationsRe[k], iterationsIm[k], i, k);
            pixelColor = [
              (color[0] + pixelColor[0]) * 0.5,
              (color[1] + pixelColor[1]) * 0.5,
              (color[2] + pixelColor[2]) * 0.5,
            ];

            buffer[idx + 0] += pixelColor[0];
            buffer[idx + 1] += pixelColor[1];
            buffer[idx + 2] += pixelColor[2];
            buffer[idx + 3] += 1;

            if (iterationsIm[k] !== 0) {
              const fy2 = height - fy; // plot symmetry
              const idx2 = (fx + fy2 * width) * 4;
              buffer[idx2 + 0] += pixelColor[0];
              buffer[idx2 + 1] += pixelColor[1];
              buffer[idx2 + 2] += pixelColor[2];
              buffer[idx2 + 3] += 1;
            }
          }
        }
      }
    }
  }

  /*let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  forEachPixel(buffer, width, height, (r, g, b, a) => {
    min = Math.min(min, a);
    max = Math.max(max, a);
  });

  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    const color = colorfunc(a / max);
    buffer[idx + 0] = color[0];
    buffer[idx + 1] = color[1];
    buffer[idx + 2] = color[2];
  });*/

  const averageHits = Math.max(1, (maxI * maxJ * 2) / (width * height));
  applyContrastBasedScalefactor(buffer, width, height, averageHits);

  buffer = convertUnitToRGBA(buffer);
  await saveImageBuffer(buffer, width, height, path);
};

const [ width, height ] = getPictureSize(size, MANDELBROT_DOMAIN);
plotBuddhabrot(`${OUTPUT_DIRECTORY}/buddhabrot.png`, width, height, MANDELBROT_DOMAIN);
