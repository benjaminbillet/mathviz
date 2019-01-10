import { simpleIfsChaosPlot } from '../ifs/chaos-game';
import { createImage, saveImage } from '../utils/picture';
import { makeKochCurveIfs, KOCH_CURVE_DOMAIN, makeKochFlakeIfs, KOCH_FLAKE_DOMAIN, makeKochAntiFlakeIfs, KOCH_ANTIFLAKE_DOMAIN } from '../ifs/koch-curve';


const plot = async (path, width, height, ifs, domain, iterations) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  simpleIfsChaosPlot(buffer, width, height, ifs, null, domain, iterations);

  await saveImage(image, path);
};

/* const plotTransformedGrid = async (path, width, height, ifs, domain) => {
  const image = createImage(width, height, 0, 0, 0, 255);
  const buffer = image.getImage().data;

  // we want to draw only the pixels that belongs to a grid composed of one line every 2 pixels
  // so we increment 2 by 2 pixels
  for (let i = 0; i < width; i += 2) {
    for (let j = 0; j < height; j += 2) {
      // each pixel of the grid is mapped to the domain...
      const [ x, y ] = mapPixelToDomain(i, j, width, height, domain);

      // ... the transformation is then applied for each function in the ifs...
      const z = new Complex(x, y);

      ifs.functions.forEach((f, i) => {
        const fz = f(z);

        // ... then the transformed 2d value is re-mapped to the pixel domain
        const [fx, fy] = mapDomainToPixel(fz.re, fz.im, domain, width, height);

        // transformed pixels that are outside the image are discarded
        if (fx < 0 || fy < 0 || fx >= width || fy >= height) {
          return;
        }

        // the pixel color will be based on the ifs
        const color = pickColorMapValue(i / ifs.functions.length, RainbowColormap);

        // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
        const idx = (fx + fy * width) * 4;
        buffer[idx + 0] = (buffer[idx + 0] + color[0]) / 2;
        buffer[idx + 1] = (buffer[idx + 1] + color[1]) / 2;
        buffer[idx + 2] = (buffer[idx + 2] + color[2]) / 2;
        buffer[idx + 3] = 255;
      });
    }
  }

  await saveImage(image, path);
};*/

let ifs = makeKochCurveIfs();
plot('koch-curve.png', 512, 512, ifs, KOCH_CURVE_DOMAIN, 1000000);

ifs = makeKochFlakeIfs();
plot('koch-flake.png', 512, 512, ifs, KOCH_FLAKE_DOMAIN, 1000000);

ifs = makeKochAntiFlakeIfs();
plot('koch-antiflake.png', 512, 512, ifs, KOCH_ANTIFLAKE_DOMAIN, 1000000);
