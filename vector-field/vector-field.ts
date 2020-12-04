import { randomNormal } from '../utils/random';
import { makeIdentity } from '../transform';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { complex } from '../utils/complex';
import { ComplexToComplexFunction, VectorFieldColorFunction, VectorFieldFunction, VectorFieldPlotter, VectorFieldTimeFunction } from '../utils/types';
import { fillPicture } from '../utils/picture';
import { mapRange } from '../utils/misc';

const r = randomNormal();
export const makeGridShuffle = (intensity = 0.001): ComplexToComplexFunction => {
  return z => complex(z.re + r() * intensity, z.im + r() * intensity, z);
};
export const DefaultGridShuffle = makeGridShuffle();

export const plotVectorField = (
  vectorFunction: VectorFieldFunction,
  colorFunc: VectorFieldColorFunction,
  plotter: VectorFieldPlotter,
  timeFunction: VectorFieldTimeFunction = () => 0,
  finalTransform = makeIdentity(),
  gridAccuracy = 0.025,
  gridDomain = BI_UNIT_DOMAIN,
  gridShuffle = DefaultGridShuffle,
  pointSpeed = 0.01,
  nbIterations = 500,
) => {
  let point = 0;
  for (let x = gridDomain.xmin; x <= gridDomain.xmax; x += gridAccuracy) {
    for (let y = gridDomain.ymin; y <= gridDomain.ymax; y += gridAccuracy) {
      const z0 = complex(x, y);
      let z = gridShuffle(complex(x, y));
      for (let i = 0; i < nbIterations; i++) {
        const color = colorFunc(z, point, i, z0);
        const time = timeFunction(z, i);
        plotter(z, color, i, time);
  
        const v = vectorFunction(z, i, time);
        z.re += pointSpeed * v.re;
        z.im += pointSpeed * v.im;
  
        z = finalTransform(z);
      }
      point++;
    }
  }
};

export const encodeVectorFieldAsImage = (vectorField: Float32Array, width: number, height: number, domain = BI_UNIT_DOMAIN) => {
  const out = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = i + j * width;
      const z = complex(vectorField[idx * 2 + 0], vectorField[idx * 2 + 1]);
      out[idx * 4 + 0] = mapRange(z.re, domain.xmin, domain.xmax, 0, 1);
      out[idx * 4 + 1] = mapRange(z.im, domain.ymin, domain.ymax, 0, 1);
      out[idx * 4 + 2] = mapRange(z.argument(), -Math.PI, Math.PI, 0, 1);
    }
  }
  return out;
};

export const decodeImageAsVectorField = (image: Float32Array, width: number, height: number, domain = BI_UNIT_DOMAIN) => {
  const out = new Float32Array(width * height * 2).fill(0);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = i + j * width;
      const z = complex(image[idx * 4 + 0], image[idx * 4 + 1]);
      out[idx * 2 + 0] = mapRange(z.re, 0, 1, domain.xmin, domain.xmax);
      out[idx * 2 + 1] = mapRange(z.im, 0, 1, domain.ymin, domain.ymax);
    }
  }
  return out;
};

