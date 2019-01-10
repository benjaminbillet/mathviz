// The Barnsley fern (https://en.wikipedia.org/wiki/Barnsley_fern#Construction) is an IFS composed of four affine functions
// The attractor of this IFS looks like a fern, each function controlling an aspect of the fern:
// - f1: base of the stem
// - f2: repetition along the stem
// - f3: left leaf
// - f4: right leaf

import { complex } from '../utils/complex';
import { makeIfs } from './build';


export const BARNSLEY_FERN_DOMAIN = { xmin: -5, xmax: 5, ymin: 0, ymax: 10 };
export const BARNSLEY_FERN_COEFFICIENTS = [
  // a,  b,    c,      d,    e,   f
  0.0,   0.0,   0.0,   0.16, 0.0, 0.0,  // f1
  0.85,  0.04,  -0.04, 0.85, 0.0, 1.60, // f2
  0.20,  -0.26, 0.23,  0.22, 0.0, 1.60, // f3
  -0.15, 0.28,  0.26,  0.24, 0.0, 0.44, // f4
];
export const BARNSLEY_FERN_PROBABILITIES = [
  0.01, // f1
  0.85, // f2
  0.07, // f3
  0.07, // f4
];


export const CYCLOSORUS_FERN_DOMAIN = { xmin: -2, xmax: 2, ymin: -0.5, ymax: 7.5 };
export const CYCLOSORUS_FERN_COEFFICIENTS = [
  // a,  b,     c,      d,    e,      f
  0.0,   0.0,   0.0,    0.25, 0.0,    -0.4, // f1
  0.95,  0.005, -0.005, 0.93, -0.002, 0.5,  // f2
  0.035, -0.2,  0.16,   0.04, -0.09,  0.02, // f3
  -0.04, 0.2,   0.16,   0.04, 0.083,  0.12, // f4
];
export const CYCLOSORUS_FERN_PROBABILITIES = [
  0.02, // f1
  0.84, // f2
  0.07, // f3
  0.07, // f4
];


export const CULCITA_FERN_DOMAIN = { xmin: -2, xmax: 2, ymin: 0, ymax: 6 };
export const CULCITA_FERN_COEFFICIENTS = [
  // a,  b,     c,      d,    e,      f
  0.0,   0.0,   0.0,   0.25, 0.0, -0.14, // f1
  0.85,  0.02,  -0.02, 0.83, 0.0, 1.0,   // f2
  0.09,  -0.28, 0.3,   0.11, 0.0, 0.6,   // f3
  -0.09, 0.28,  0.3,   0.09, 0.0, 0.7,   // f4
];
export const CULCITA_FERN_PROBABILITIES = [
  0.02, // f1
  0.84, // f2
  0.07, // f3
  0.07, // f4
];


export const makeFernIfs = (m = BARNSLEY_FERN_COEFFICIENTS, p = BARNSLEY_FERN_PROBABILITIES) => {
  // https://en.wikipedia.org/wiki/Barnsley_fern#Construction
  const f1 = (z) => complex(z.re * m[0]  + z.im * m[1]  + m[4],  z.re * m[2]  + z.im * m[3]  + m[5]);
  const f2 = (z) => complex(z.re * m[6]  + z.im * m[7]  + m[10], z.re * m[8]  + z.im * m[9]  + m[11]);
  const f3 = (z) => complex(z.re * m[12] + z.im * m[13] + m[16], z.re * m[14] + z.im * m[15] + m[17]);
  const f4 = (z) => complex(z.re * m[18] + z.im * m[19] + m[22], z.re * m[20] + z.im * m[21] + m[23]);
  return makeIfs([ f1, f2, f3, f4 ], p);
};

