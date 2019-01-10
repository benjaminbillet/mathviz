import { complex } from '../utils/complex';

import { getPictureSize, mapPixelToDomain, createImage, saveImageBuffer, normalizeBuffer } from '../utils/picture';
import { secantSea, SECANT_SEA_DOMAIN } from '../fractalsets/secantsea';
import { makeColorMapFunction, buildConstrainedColorMap, buildColorMap, convertUnitToRGBA } from '../utils/color';
import { downscale } from '../utils/downscale';
import { CATERPILLAR } from '../utils/palette';
import { performClahe } from '../utils/histogram';


let colormap = buildConstrainedColorMap(
  [ [ 255, 255, 255 ], [ 0, 32, 60 ], [ 128, 0, 128 ], [ 175, 20, 25 ], [ 175, 20, 25 ] ],
  [ 0, 0.1, 0.14, 0.16, 1 ],
);
const colorfuncRaw = makeColorMapFunction(colormap);

colormap = buildColorMap(CATERPILLAR);
const colorfuncClahe = makeColorMapFunction(colormap);

export const plotFunction = async (path, width, height, f, domain) => {
  const input = new Uint8Array(width * height);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const [ x, y ] = mapPixelToDomain(i, j, width, height, domain);

      const intensity = f(complex(x, y));
      const idx = (i + j * width);
      input[idx] = Math.trunc(intensity * 255);
    }
  }

  await saveImageBuffer(input.reduce((result, val, i) => {
    result[i * 4 + 0] = val;
    result[i * 4 + 1] = val;
    result[i * 4 + 2] = val;
    result[i * 4 + 3] = 255;
    return result;
  }, new Uint8Array(width * height * 4)), width, height, path + 'raw.png');

  const imageRaw = createImage(width, height);
  const bufferRaw = imageRaw.getImage().data;

  input.forEach((val, i) => {
    const color = colorfuncRaw(val / 255);
    bufferRaw[i * 4 + 0] = color[0];
    bufferRaw[i * 4 + 1] = color[1];
    bufferRaw[i * 4 + 2] = color[2];
    bufferRaw[i * 4 + 3] = 255;
  });
  await saveImageBuffer(bufferRaw, width, height, path + 'rawcolored.png');

  let resizedBuffer = downscale(normalizeBuffer(new Float32Array(bufferRaw)), width, height, 0.2);
  await saveImageBuffer(convertUnitToRGBA(resizedBuffer), Math.trunc(0.2 * width), Math.trunc(0.2 * height), path + 'rawcoloredsampled.png');


  performClahe(input, width, height, input);

  await saveImageBuffer(input.reduce((result, val, i) => {
    result[i * 4 + 0] = val;
    result[i * 4 + 1] = val;
    result[i * 4 + 2] = val;
    result[i * 4 + 3] = 255;
    return result;
  }, new Uint8Array(width * height * 4)), width, height, path + 'clahe.png');

  const imageClahe = createImage(width, height);
  const bufferClahe = imageClahe.getImage().data;

  input.forEach((val, i) => {
    const color = colorfuncClahe(val / 255);
    bufferClahe[i * 4 + 0] = color[0];
    bufferClahe[i * 4 + 1] = color[1];
    bufferClahe[i * 4 + 2] = color[2];
    bufferClahe[i * 4 + 3] = 255;
  });
  await saveImageBuffer(bufferClahe, width, height, path + 'clahecolored.png');

  resizedBuffer = downscale(normalizeBuffer(new Float32Array(bufferClahe)), width, height, 0.2);
  await saveImageBuffer(convertUnitToRGBA(resizedBuffer), Math.trunc(0.2 * width), Math.trunc(0.2 * height), path + 'clahecoloredsampled.png');
};

const plotSecantSea = async (c, bailoutSquared, maxIterations, domain) => {
  const [ width, height ] = getPictureSize(10240, domain);
  const configuredSecantSea = (z) => secantSea(z, c, bailoutSquared, maxIterations);
  await plotFunction(`secantsea-c=${c.re}+${c.im}i.png`, width, height, configuredSecantSea, domain);
};

plotSecantSea(complex(0.102, -0.04), 10000, 100, SECANT_SEA_DOMAIN);
plotSecantSea(complex(1.098, 1.402), 10000, 100, SECANT_SEA_DOMAIN);
plotSecantSea(complex(9.984, 7.55), 10000, 100, SECANT_SEA_DOMAIN);
plotSecantSea(complex(0.662, 1.086), 10000, 100, SECANT_SEA_DOMAIN);
plotSecantSea(complex(-0.354, 0.162), 10000, 100, SECANT_SEA_DOMAIN);
