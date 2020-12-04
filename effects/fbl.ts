import { getRedmeanColorDistance } from '../utils/color';
import { makeGaussian } from '../utils/random';
import { RealToRealFunction } from '../utils/types';
import { fillPicture } from '../utils/picture';
import { eulerComplex, round } from '../utils/complex';
import { applyLuminosityPosterize } from './posterize';

export const applyFblPosterized = (input: Float32Array, width: number, height: number, etf: Float32Array, sigmae = 2, re = 50, sigmag = 2, rg = 10, kernSize = 5, iterations = 5, levels = 5) => {
  const fbl = applyFbl(input, width, height, etf, sigmae, re, sigmag, rg, kernSize, iterations);
  return applyLuminosityPosterize(fbl, width, height, levels);
};

export const applyFbl = (input: Float32Array, width: number, height: number, etf: Float32Array, sigmae = 2, re = 50, sigmag = 2, rg = 10, kernSize = 5, iterations = 5) => {
  let result = null;
  for (let k = 0; k < iterations; k++) {
    const ce = computeCe(input, width, height, etf, sigmae, re, kernSize);
    const cg = computeCg(ce, width, height, etf, sigmag, rg, kernSize);
    result = cg;
  }
  return result;
};


// Equation (12) http://www.cs.umsl.edu/~kang/Papers/kang_tvcg09.pdf
const computeCe = (picture: Float32Array, width: number, height: number, etf: Float32Array, sigmae: number, re: number, alpha: number) => {
  const sigeGauss = makeGaussian(sigmae, 0);
  const reGauss = makeGaussian(re, 0);

  const ce = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const r0 = picture[(i + j * width) * 4 + 0];
      const g0 = picture[(i + j * width) * 4 + 1];
      const b0 = picture[(i + j * width) * 4 + 2];

      let weightSum = sigeGauss(0) * computeH(r0, g0, b0, r0, g0, b0, reGauss);
      let sumR = weightSum * r0;
      let sumG = weightSum * g0;
      let sumB = weightSum * b0;

      let x = i;
      let y = j;

      for (let s = -alpha; s < 0; s++) {
        const tx = etf[(Math.trunc(x) + Math.trunc(y) * width) * 2];
        const ty = etf[(Math.trunc(x) + Math.trunc(y) * width) * 2 + 1];

        const angle = Math.atan2(-ty, -tx);

        const d = round(eulerComplex(angle));
        x += d.re;
        y += d.im;

        if (x < 0 || x >= width || y < 0 || y >= height) {
          break;
        }
        const idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;
        const r = picture[idx + 0];
        const g = picture[idx + 1];
        const b = picture[idx + 2];  
    
        const ft = sigeGauss(0) * computeH(r0, g0, b0, r, g, b, reGauss);
        weightSum += ft;
        sumR += ft * r;
        sumG += ft * g;
        sumB += ft * b;
      }

      x = i;
      y = j;
    
      for (let s = 1; s <= alpha; s++) {
        const tx = etf[(Math.trunc(x) + Math.trunc(y) * width) * 2];
        const ty = etf[(Math.trunc(x) + Math.trunc(y) * width) * 2 + 1];

        const angle = Math.atan2(ty, tx);

        const d = round(eulerComplex(angle));
        x += d.re;
        y += d.im;

        if (x < 0 || x >= width || y < 0 || y >= height) {
          break;
        }
        const idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;
        const r = picture[idx + 0];
        const g = picture[idx + 1];
        const b = picture[idx + 2];  
    
        const ft = sigeGauss(0) * computeH(r0, g0, b0, r, g, b, reGauss);
        weightSum += ft;
        sumR += ft * r;
        sumG += ft * g;
        sumB += ft * b;
      }

      if (weightSum === 0) {
        ce[(i + j * width) * 4 + 0] = 0;
        ce[(i + j * width) * 4 + 1] = 0;
        ce[(i + j * width) * 4 + 2] = 0;
      } else {
        ce[(i + j * width) * 4 + 0] = sumR / weightSum;
        ce[(i + j * width) * 4 + 1] = sumG / weightSum;
        ce[(i + j * width) * 4 + 2] = sumB / weightSum;
      }
    }
  }
  return ce;
}

// Equation (13) http://www.cs.umsl.edu/~kang/Papers/kang_tvcg09.pdf
const computeH = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number, gauss: RealToRealFunction) => {
  return gauss(getRedmeanColorDistance(r1, g1, b1, r2, g2, b2));
};

// Equation (14) http://www.cs.umsl.edu/~kang/Papers/kang_tvcg09.pdf
const computeCg = (ce: Float32Array, width: number, height: number, etf: Float32Array, sigmag: number, rg: number, beta: number) => {
  const siggGauss = makeGaussian(sigmag, 0);
  const rgGauss = makeGaussian(rg, 0);

  const cg = fillPicture(new Float32Array(width * height * 4), 0, 0, 0, 1);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const r0 = ce[(i + j * width) * 4 + 0];
      const g0 = ce[(i + j * width) * 4 + 1];
      const b0 = ce[(i + j * width) * 4 + 2];

      let weightSum = siggGauss(0) * computeH(r0, g0, b0, r0, g0, b0, rgGauss);
      let sumR = weightSum * r0;
      let sumG = weightSum * g0;
      let sumB = weightSum * b0;

      const tx = etf[(i + j * width) * 2];
      const ty = etf[(i + j * width) * 2 + 1];

      let perpendicularAngle = Math.atan2(-tx, ty);
      let d = round(eulerComplex(perpendicularAngle));
      let x = i;
      let y = j;

      for (let t = -beta; t < 0; t++) {
        x += d.re;
        y += d.im;

        if (x < 0 || x >= width || y < 0 || y >= height) {
          break;
        }
        const idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;
        const r = ce[idx + 0];
        const g = ce[idx + 1];
        const b = ce[idx + 2];  
    
        const ft = siggGauss(0) * computeH(r0, g0, b0, r, g, b, rgGauss);
        weightSum += ft;
        sumR += ft * r;
        sumG += ft * g;
        sumB += ft * b;
      }

      perpendicularAngle = Math.atan2(tx, -ty);
      d = round(eulerComplex(perpendicularAngle));
      x = i;
      y = j;

      for (let t = 1; t <= beta; t++) {
        x += d.re;
        y += d.im;

        if (x < 0 || x >= width || y < 0 || y >= height) {
          break;
        }
        const idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;
        const r = ce[idx + 0];
        const g = ce[idx + 1];
        const b = ce[idx + 2];  
    
        const ft = siggGauss(0) * computeH(r0, g0, b0, r, g, b, rgGauss);
        weightSum += ft;
        sumR += ft * r;
        sumG += ft * g;
        sumB += ft * b;
      }

      if (weightSum === 0) {
        cg[(i + j * width) * 4 + 0] = 0;
        cg[(i + j * width) * 4 + 1] = 0;
        cg[(i + j * width) * 4 + 2] = 0;
      } else {
        cg[(i + j * width) * 4 + 0] = sumR / weightSum;
        cg[(i + j * width) * 4 + 1] = sumG / weightSum;
        cg[(i + j * width) * 4 + 2] = sumB / weightSum;
      }
    }
  }

  return cg;
}