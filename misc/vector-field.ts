import { randomNormal } from '../utils/random';
import { makeIdentity } from '../transform';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { complex } from '../utils/complex';
import { ColorSteal, ComplexPlotter, ComplexToComplexFunction, VectorFieldFunction, VectorFieldTimeFunction } from '../utils/types';

const r = randomNormal();
export const makeGridShuffle = (intensity = 0.001): ComplexToComplexFunction => {
  return z => complex(z.re + r() * intensity, z.im + r() * intensity, z);
};
export const DefaultGridShuffle = makeGridShuffle();

export const plotVectorField = (
  vectorFunction: VectorFieldFunction,
  colorFunc: ColorSteal,
  plotter: ComplexPlotter,
  timeFunction: VectorFieldTimeFunction = () => 0,
  finalTransform = makeIdentity(),
  gridAccuracy = 0.025,
  gridDomain = BI_UNIT_DOMAIN,
  gridShuffle = DefaultGridShuffle,
  pointSpeed = 0.01,
  nbIterations = 500,
) => {
  const points = [];
  // build the vector grid
  for (let x = gridDomain.xmin; x <= gridDomain.xmax; x += gridAccuracy) {
    for (let y = gridDomain.ymin; y <= gridDomain.ymax; y += gridAccuracy) {
      points.push(gridShuffle(complex(x, y)));
    }
  }

  for (let i = 0; i < nbIterations; i++) {
    for (let j = 0; j < points.length; j++) {
      const z = points[j];

      const color = colorFunc(z.re, z.im, j, i);
      plotter(z, color, 1);

      const time = timeFunction(z, i);
      const v = vectorFunction(z, i, time);
      z.re += pointSpeed * v.re;
      z.im += pointSpeed * v.im;

      const fz = finalTransform(z);
      z.re = fz.re;
      z.im = fz.im;
    }
  }
};
