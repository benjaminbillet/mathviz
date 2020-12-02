import { ComplexToComplexFunction } from '../utils/types';
import { forEachPixel, mapDomainToPixel, mapPixelToDomain } from '../utils/picture';
import { BI_UNIT_DOMAIN } from '../utils/domain';
import { ComplexNumber } from '../utils/complex';

export const applyTransform = (input: Float32Array, width: number, height: number, f: ComplexToComplexFunction, domain = BI_UNIT_DOMAIN) => {
  const output = new Float32Array(width * height * 4);
  const z = new ComplexNumber(0, 0);
  forEachPixel(input, width, height, (r, g, b, a, i, j, idx) => {
    const [ x, y ] = mapPixelToDomain(i, j, width, height, domain);

    z.set(x, y);
    const fz = f(z);
    const [ fx, fy ] = mapDomainToPixel(fz.re, fz.im, domain, width, height);
    const fidx = (fx + fy * width) * 4;

    output[idx + 0] = input[fidx + 0];
    output[idx + 1] = input[fidx + 1];
    output[idx + 2] = input[fidx + 2];
    output[idx + 3] = 1;
  });
  return output;
};
