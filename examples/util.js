import { mapPixelToDomain, saveImage, createImage, saveImageBuffer, forEachPixel } from '../utils/picture';
import { complex } from '../utils/complex';
import { simpleWalkChaosPlot } from '../ifs/chaos-game';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { withinPolygon } from '../utils/polygon';
import { randomComplex } from '../utils/random';
import { convertUnitToRGBA, applyLinearScalefactor } from '../utils/color';
import { performClahe } from '../utils/histogram';

export const plotFunction = async (path, width, height, f, domain = BI_UNIT_DOMAIN, colorfunc) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const [ x, y ] = mapPixelToDomain(i, j, width, height, domain);

      let color = f(complex(x, y));
      if (color.length == null) {
        color = colorfunc(color);
      }

      const idx = (i + j * width) * 4;
      buffer[idx + 0] = color[0];
      buffer[idx + 1] = color[1];
      buffer[idx + 2] = color[2];
      buffer[idx + 3] = 255;
    }
  }

  await saveImage(image, path);
};

export const plotWalk = async (path, width, height, walk, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  let buffer = new Float32Array(width * height * 4);

  simpleWalkChaosPlot(buffer, width, height, walk, null, domain, nbIterations);

  buffer = applyLinearScalefactor(buffer, width, height);
  buffer = convertUnitToRGBA(buffer);

  await saveImageBuffer(buffer, width, height, path);
};

export const plotWalkWithClahe = async (path, width, height, walk, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  let buffer = new Float32Array(width * height * 4);

  simpleWalkChaosPlot(buffer, width, height, walk, null, domain, nbIterations);

  buffer = applyLinearScalefactor(buffer, width, height);

  // convert into a single channel grayscale picture
  let newBuffer = new Uint8Array(width * height);
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => newBuffer[idx / 4] = r * 255);

  performClahe(newBuffer, width, height, newBuffer, 16, 16, 256, 4);

  // convert back into a rgba image
  await saveImageBuffer(newBuffer.reduce((result, val, i) => {
    result[i * 4 + 0] = val;
    result[i * 4 + 1] = val;
    result[i * 4 + 2] = val;
    result[i * 4 + 3] = 255;
    return result;
  }, new Uint8Array(width * height * 4)), width, height, path);
};

export const plotPolygon = async (path, width, height, polygon, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  let buffer = new Float32Array(width * height * 4);

  const walk = () => {
    let zn = randomComplex();
    while (withinPolygon(zn, polygon) === false) {
      zn = randomComplex();
    }
    return zn;
  };

  simpleWalkChaosPlot(buffer, width, height, walk, null, domain, nbIterations);

  buffer = convertUnitToRGBA(buffer);
  await saveImageBuffer(buffer, width, height, path);
};
