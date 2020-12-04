import { applyLuminanceMap } from '../effects/luminanceMap';
import { add, complex, ComplexNumber, dot, normalize } from './complex'
import { convolve, SobelHorizontal5x5Kernel, SobelVertical5x5Kernel } from './convolution';
import { euclidean, euclidean2d } from './distance';
import { normalizeBuffer } from './picture';
import affine from './affine';
import { applyGaussianBlur } from '../effects/blur';

// http://umsl.edu/cmpsci/about/People/Faculty/HenryKang/coon.pdf
// https://estebanhufstedler.com/2019/12/24/image-orientation
// http://www.cs.umsl.edu/~kang/Papers/kang_tvcg09.pdf

interface Etf {
  flowField: Float32Array, // array of vectors
  gradientMag: Float32Array, // array of RGBA components
  nextFlowField: Float32Array, // array of vectors
  width: number,
  height: number,
}

export const computeSeparableEtf = (input: Float32Array, width: number, height: number, iterations = 3) => {
  const etf0 = getEtf0(input, width, height);

  const etf = etf0;
  for (let k = 0; k < iterations; k++) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const v = computeNewTangentHorizontal(etf, complex(i, j), 5);  
        const idx = (i + j * width) * 2;
        etf.nextFlowField[idx] = v.re;
        etf.nextFlowField[idx + 1] = v.im;
      }
    }
    etf.flowField.set(etf.nextFlowField);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const v = computeNewTangentVertical(etf, complex(i, j), 5);  
        const idx = (i + j * width) * 2;
        etf.nextFlowField[idx] = v.re;
        etf.nextFlowField[idx + 1] = v.im;
      }
    }
    etf.flowField.set(etf.nextFlowField);
  }

  return etf.flowField;
};

export const computeEtf = (input: Float32Array, width: number, height: number, iterations = 3) => {
  const etf0 = getEtf0(input, width, height);

  const etf = etf0;
  for (let k = 0; k < iterations; k++) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const v = computeNewTangent(etf, complex(i, j), 5);  
        const idx = (i + j * width) * 2;
        etf.nextFlowField[idx] = v.re;
        etf.nextFlowField[idx + 1] = v.im;
      }
    }
    etf.flowField.set(etf.nextFlowField);
  }

  return etf.flowField;
};

const getEtf0 = (input: Float32Array, width: number, height: number): Etf => {
  const smooth = applyGaussianBlur(input, width, height, 5);
  const lum = applyLuminanceMap(smooth, width, height);
  normalizeBuffer(lum, width, height);

  const horizontalDerivative = convolve(lum, new Float32Array(lum.length), width, height, SobelHorizontal5x5Kernel);
  const verticalDerivative = convolve(lum, new Float32Array(lum.length), width, height, SobelVertical5x5Kernel);
  const gradientMag = lum.map((_, i) => euclidean(horizontalDerivative[i], verticalDerivative[i]));

  normalizeBuffer(gradientMag, width, height);

  const rotate90 = affine.rotate(Math.PI / 2);

  const flowField = new Float32Array(width * height * 2).fill(0);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx1 = (i + j * width) * 2;
      const idx2 = (i + j * width) * 4;

      const v = affine.applyAffine2dFromMatrix(rotate90, normalize(complex(verticalDerivative[idx2], horizontalDerivative[idx2])));
      flowField[idx1] = v.re;
      flowField[idx1 + 1] = v.im;
    }
  }

  return {
    flowField,
    nextFlowField: new Float32Array(flowField.length).fill(0),
    gradientMag,
    width,
    height,
  };
}


// Equation (2)
const computeWs = (x: ComplexNumber, y: ComplexNumber, kernSize: number) => {
  if (euclidean2d(x.re, x.im, y.re, y.im) < kernSize) {
    return 1;
  }
  return 0;
};

// Equation (3)
const computeWm = (etf: Etf, x: ComplexNumber, y: ComplexNumber, eta = 1) => {
  const xidx = (x.re + x.im * etf.width) * 2;
  const yidx = (y.re + y.im * etf.width) * 2;

  const deltax = etf.gradientMag[yidx] - etf.gradientMag[xidx];
  const deltay = etf.gradientMag[yidx + 1] - etf.gradientMag[xidx + 1];

  return complex(
    (1 + Math.tanh(eta * deltax)) / 2,
    (1 + Math.tanh(eta * deltay)) / 2,
  );
};

// Equation (4)
const computeWd = (tcurx: ComplexNumber, tcury: ComplexNumber) => {
  return Math.abs(dot(tcurx, tcury));
};

// Equation (5)
const computePhi = (tcurx: ComplexNumber, tcury: ComplexNumber) => {
  if (dot(tcurx, tcury) > 0) {
    return 1;
  }
  return -1;
}

// Equation (1): full kernel filter
const computeNewTangent = (etf: Etf, x: ComplexNumber, kernSize: number) => {
  // tcur(x)
  let idx = (x.re + x.im * etf.width) * 2;
  const tcurx = complex(etf.flowField[idx], etf.flowField[idx + 1]);

  const newt = complex();
  for (let i = -kernSize; i <= kernSize; i++) {
    for (let j = -kernSize; j <= kernSize; j++) {
      const y = add(x, complex(i, j));
      if (y.re < 0 || y.re >= etf.width || y.im < 0 || y.im >= etf.height) { 
        continue;
      }
      // tcur(y)
      idx = (y.re + y.im * etf.width) * 2;
      const tcury = complex(etf.flowField[idx], etf.flowField[idx + 1]);
    
      const phi = computePhi(tcurx, tcury);
      const ws = computeWs(x, y, kernSize);
      const wm = computeWm(etf, x, y);
      const wd = computeWd(tcurx, tcury);
      
      newt.re += tcury.re * phi * ws * wm.re * wd;
      newt.im += tcury.im * phi * ws * wm.im * wd;
    }
  }

  return normalize(newt);
};

// Equation (1): separable kernel filter
const computeNewTangentHorizontal = (etf: Etf, x: ComplexNumber, kernSize: number) => {
  let idx = (x.re + x.im * etf.width) * 2;
  const tcurx = complex(etf.flowField[idx], etf.flowField[idx + 1]); // tcur(x)

  const newt = complex();

  for (let k = -kernSize; k <= kernSize; k++) {
    const y = add(x, complex(k, 0));
    if (y.re < 0 || y.re >= etf.width || y.im < 0 || y.im >= etf.height) { 
      continue;
    }
    // tcur(y)
    idx = (y.re + y.im * etf.width) * 2;
    const tcury = complex(etf.flowField[idx], etf.flowField[idx + 1]); // tcur(y)

    const phi = computePhi(tcurx, tcury);
    const ws = computeWs(x, y, kernSize);
    const wm = computeWm(etf, x, y);
    const wd = computeWd(tcurx, tcury);
    
    newt.re += tcury.re * phi * ws * wm.re * wd;
    newt.im += tcury.im * phi * ws * wm.im * wd;
  }

  return newt;
}
const computeNewTangentVertical = (etf: Etf, x: ComplexNumber, kernSize: number) => {
  let idx = (x.re + x.im * etf.width) * 2;
  const tcurx = complex(etf.flowField[idx], etf.flowField[idx + 1]); // tcur(x)

  const newt = complex();

  for (let k = -kernSize; k <= kernSize; k++) {
    const y = add(x, complex(0, k));
    if (y.re < 0 || y.re >= etf.width || y.im < 0 || y.im >= etf.height) { 
      continue;
    }
    // tcur(y)
    idx = (y.re + y.im * etf.width) * 2;
    const tcury = complex(etf.flowField[idx], etf.flowField[idx + 1]); // tcur(y)

    const phi = computePhi(tcurx, tcury);
    const ws = computeWs(x, y, kernSize);
    const wm = computeWm(etf, x, y);
    const wd = computeWd(tcurx, tcury);
    
    newt.re += tcury.re * phi * ws * wm.re * wd;
    newt.im += tcury.im * phi * ws * wm.im * wd;
  }

  return normalize(newt);
}