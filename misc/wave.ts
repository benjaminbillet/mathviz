import { euclidean } from '../utils/distance';
import { TWO_PI } from '../utils/math';
import { ComplexNumber } from '../utils/complex';
import { ColorMapFunction, ComplexToRealFunction, RealToRealFunction } from '../utils/types';


export const radialwave = (z: ComplexNumber, freq = 1, phase = 0, distanceFunc = euclidean) => {
  return Math.sin(TWO_PI * distanceFunc(z.re, z.im) * freq + phase);
};

export const makeRadialwave = (freq = 1, phase = 0, distanceFunc = euclidean): ComplexToRealFunction => {
  return (z) => radialwave(z, freq, phase, distanceFunc);
};

export const wave = (z: ComplexNumber, freq = 1, angle = 0, phase = 0, cosine = false, abs = false) => {
  // calculate phase in direction of angle
  const x = TWO_PI * freq * z.re * Math.sin(angle);
  const y = TWO_PI * freq * z.im * Math.cos(angle);

  let v = x + y + phase;
  if (abs) {
    v = Math.abs(v);
  }
  // change to cosine for even symmetry
  if (cosine) {
    return Math.cos(v);
  }
  return Math.sin(v);
};

export const makeWave = (freq = 1, angle = 0, phase = 0, cosine = false, abs = false): ComplexToRealFunction => {
  return z => wave(z, freq, angle, phase, cosine, abs);
};

export const makeMultiwave = (freq = 1, nbWaves = 1, phase = 0, cosine = false, abs = false): ComplexToRealFunction => {
  const freqs = new Array(nbWaves).fill(freq);
  const angles = freqs.map((_, i) => i * Math.PI / nbWaves);

  return (z) => {
    const sum = freqs.reduce((prev, f, i) => {
      return prev + wave(z, f, angles[i], phase, cosine, abs);
    }, 0);
    return sum / freqs.length;
  };
};

export const polar = (z: ComplexNumber, freq = 1, angle = 0, phase = 0, cosine = false, distanceFunc = euclidean) => {
  const r = distanceFunc(z.re, z.im);
  const theta = z.argument();

  const x = (theta * Math.cos(angle) - r * Math.sin(angle)) * freq + phase;
  if (cosine) {
    return Math.cos(x);
  }
  return Math.sin(x);
};

export const makePolar = (freq = 1, angle = 0, phase = 0, cosine = false, distanceFunc = euclidean): ComplexToRealFunction => {
  return z => polar(z, freq, angle, phase, cosine, distanceFunc);
};

export const makeMultipolar = (freq = 1, nbWaves = 1, phase = 0, cosine = false, distanceFunc = euclidean): ComplexToRealFunction => {
  const freqs = new Array(nbWaves).fill(freq);
  const angles = freqs.map((_, i) => i * Math.PI / nbWaves);

  return (z) => {
    const sum = freqs.reduce((prev, f, i) => {
      return prev + polar(z, f, angles[i], phase, cosine, distanceFunc);
    }, 0);
    return sum / freqs.length;
  };
};

export const makeStripped = (f: ComplexToRealFunction, stripeFreq = 2, cosine = false): ComplexToRealFunction => {
  if (cosine) {
    return z => Math.cos(TWO_PI * stripeFreq * biunitToUnit(f(z)));
  }
  return z => Math.sin(TWO_PI * stripeFreq * biunitToUnit(f(z)));
};

export const biunitToUnit: RealToRealFunction = v => (v + 1) / 2;

export const makeBiunitColorFunction = (colorfunc: ColorMapFunction): ColorMapFunction => {
  return v => colorfunc((v + 1) / 2);
};

export const composeWaveFunctions = (functions: ComplexToRealFunction[]): ComplexToRealFunction => {
  return (z) => {
    const sum = functions.reduce((prev, f) => prev + f(z), 0);
    return sum / functions.length;
  };
};
