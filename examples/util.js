import { mapPixelToDomain, saveImage, createImage } from '../utils/picture';
import { complex } from '../utils/complex';
import { simpleWalkChaosPlot } from '../ifs/chaos-game';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { withinPolygon } from '../utils/polygon';
import { randomComplex } from '../utils/random';

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
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  simpleWalkChaosPlot(buffer, width, height, walk, null, domain, nbIterations);

  await saveImage(image, path);
};

export const plotPolygon = async (path, width, height, polygon, domain = BI_UNIT_DOMAIN, nbIterations = 10000) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  const walk = () => {
    let zn = randomComplex();
    while (withinPolygon(zn, polygon) === false) {
      zn = randomComplex();
    }
    return zn;
  };

  simpleWalkChaosPlot(buffer, width, height, walk, null, domain, nbIterations);

  await saveImage(image, path);
};
