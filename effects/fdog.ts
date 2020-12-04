import { makeGaussian } from '../utils/random';
import { RealToRealFunction } from '../utils/types';
import { applyLuminanceMap } from './luminanceMap';
import { fillPicture } from '../utils/picture';
import { eulerComplex } from '../utils/complex';
import { applyGaussianBlur } from './blur';
import { normalizeBuffer } from '../utils/picture';

// http://umsl.edu/cmpsci/about/People/Faculty/HenryKang/coon.pdf
// http://www.cs.umsl.edu/~kang/Papers/kang_tvcg09.pdf

const SIGMA_S_FACTOR = 1.6;

const makeDogFilter = (sigc: number, rho: number): RealToRealFunction => {
  const sigs = SIGMA_S_FACTOR * sigc;
  const sigcGauss = makeGaussian(sigc, 0);
  const sigsGauss = makeGaussian(sigs, 0);
  return (x) => sigcGauss(x) - rho * sigsGauss(x);
};

export const applyFdog = (input: Float32Array, width: number, height: number, etf: Float32Array, sigmam = 3, sigmac = 1, rho = 0.99, alpha = 3, beta = 3, tau = 0.999, iterations = 3) => {
  let luminosityMap = applyLuminanceMap(input, width, height);

  let lines;
  for (let k = 0; k < iterations; k++) {
    luminosityMap = applyGaussianBlur(luminosityMap, width, height, 3);
    normalizeBuffer(luminosityMap, width, height);

    const hg = computeHg(luminosityMap, width, height, etf, sigmac, rho, beta);
    const he = computeHe(hg, width, height, etf, sigmam, alpha);
    lines = binaryThreshold(he, width, height, tau);

    // superimposing lines to the luminosity map
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const idx1 = i + j * width;
        const idx2 = idx1 * 4;
        luminosityMap[idx2 + 0] = Math.min(luminosityMap[idx2 + 0], lines[idx1]);
        luminosityMap[idx2 + 1] = Math.min(luminosityMap[idx2 + 1], lines[idx1]);
        luminosityMap[idx2 + 2] = Math.min(luminosityMap[idx2 + 2], lines[idx1]);
      }
    }
  }

  const result = fillPicture(new Float32Array(input.length), 0, 0, 0, 1);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx1 = i + j * width;
      const idx2 = idx1 * 4;
      result[idx2 + 0] = lines[idx1];
      result[idx2 + 1] = lines[idx1];
      result[idx2 + 2] = lines[idx1];
      result[idx2 + 3] = 1;
    }
  }

  return result;
};

export const applyFdog2 = (input: Float32Array, width: number, height: number, etf: Float32Array, sigmam = 3, sigmac = 1, rho = 0.99, tau = 0.5, iterations = 3) => {
  const alpha = findKernelSize(makeGaussian(sigmam));
  const beta = findKernelSize(makeGaussian(sigmac));
  console.log('Automated computation of alpha and beta', alpha, beta);
  return applyFdog(input, width, height, etf, sigmam, sigmac, rho, alpha, beta, tau, iterations);
};

// Equation (10) http://www.cs.umsl.edu/~kang/Papers/kang_tvcg09.pdf
const computeHg = (luminosityMap: Float32Array, width: number, height: number, etf: Float32Array, sigmac: number, rho: number, beta: number) => {
  const filter = makeDogFilter(sigmac, rho);
  const hg = new Float32Array(width * height).fill(0);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let weightSum = filter(0);
      let sum = weightSum * luminosityMap[(i + j * width) * 4];

      const tx = etf[(i + j * width) * 2];
      const ty = etf[(i + j * width) * 2 + 1];

      let perpendicularAngle = Math.atan2(-tx, ty);
      let d = eulerComplex(perpendicularAngle).round();
      let x = i;
      let y = j;

      for (let t = -beta; t < 0; t++) {
        x += d.re;
        y += d.im;

        if (x < 0 || x >= width || y < 0 || y >= height) {
          break;
        }
        const idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;
    
        const ft = filter(t);
        weightSum += ft;
        sum += (ft * luminosityMap[idx]);
      }

      perpendicularAngle = Math.atan2(tx, -ty);
      d = eulerComplex(perpendicularAngle).round();
      x = i;
      y = j;

      for (let t = 1; t <= beta; t++) {
        x += d.re;
        y += d.im;

        if (x < 0 || x >= width || y < 0 || y >= height) {
          break;
        }
        const idx = Math.trunc(x) + Math.trunc(y) * width;
    
        const ft = filter(t);
        weightSum += ft;
        sum += (ft * luminosityMap[idx * 4]);
      }
      if (weightSum === 0) {
        hg[i + j * width] = 0;
      } else {
        hg[i + j * width] = sum / weightSum;
      }
    }
  }

  return hg;
}

// Equation (11) http://www.cs.umsl.edu/~kang/Papers/kang_tvcg09.pdf
const computeHe = (hg: Float32Array, width: number, height: number, etf: Float32Array, sigmam: number, alpha: number) => {
  const sigmGauss = makeGaussian(sigmam, 0);
  const he = new Float32Array(width * height).fill(0);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let weightSum = sigmGauss(0);
      let sum = weightSum * hg[i + j * width];

      let x = i;
      let y = j;

      for (let s = -alpha; s < 0; s++) {
        const tx = etf[(Math.trunc(x) + Math.trunc(y) * width) * 2];
        const ty = etf[(Math.trunc(x) + Math.trunc(y) * width) * 2 + 1];

        const angle = Math.atan2(-ty, -tx);
        const d = eulerComplex(angle).round();
        x += d.re;
        y += d.im;

        if (x < 0 || x >= width || y < 0 || y >= height) {
          break;
        }
        const idx = Math.trunc(x) + Math.trunc(y) * width;
    
        const ft = sigmGauss(s);
        weightSum += ft;
        sum += (ft * hg[idx]);
      }

      x = i;
      y = j;
    
      for (let s = 1; s <= alpha; s++) {
        const tx = etf[(Math.trunc(x) + Math.trunc(y) * width) * 2];
        const ty = etf[(Math.trunc(x) + Math.trunc(y) * width) * 2 + 1];

        const angle = Math.atan2(ty, tx);
        const d = eulerComplex(angle).round();
        x += d.re;
        y += d.im;

        if (x < 0 || x >= width || y < 0 || y >= height) {
          break;
        }
        const idx = Math.trunc(x) + Math.trunc(y) * width;
    
        const ft = sigmGauss(s);
        weightSum += ft;
        sum += (ft * hg[idx]);
      }

      if (weightSum === 0) {
        he[i + j * width] = 0;
      } else {
        he[i + j * width] = sum / weightSum;
      }
    }
  }
  return he;
};

const binaryThreshold = (he: Float32Array, width: number, height: number, tau: number) => {
  const result = new Float32Array(he.length).fill(0);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = i + j * width;
      const h = he[idx];
      result[idx] = 1;
      if (h < 0 && (1 + Math.tanh(h)) < tau) {
        result[idx] = 0;
      }
    }
  }
  return result;
};

const findKernelSize = (gaussian: RealToRealFunction, threshold = 0.01, minSize = 3, maxSize = 20) => {
  for (let i = minSize; i <= maxSize; i++) {
    if (gaussian(i) <= threshold) {
      return i;
    }
  }
  return maxSize;
};
