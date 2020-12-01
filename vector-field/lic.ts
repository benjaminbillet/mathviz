import { applyLuminanceMap } from '../effects/luminanceMap';
import { makeValueNoise } from '../noise/valueNoise';
import { fillPicture, normalizeBuffer } from '../utils/picture';
import { UpscaleSamplers } from '../utils/upscale';

// http://cs.brown.edu/courses/csci2370/2000/1999/cabral.pdf
// http://w3.impa.br/~rdcastan/Visualization/docs/LIC.pdf

// vectorField = array of vectors
export const applyLicToNoise = (vectorField: Float32Array, width: number, height: number, L = 10) => {
  const noise = applyLuminanceMap(makeValueNoise(width, height, width, height, UpscaleSamplers.NearestNeighbor), width, height);
  return applyLicToPicture(noise, vectorField, width, height, L);
};

// input = picture to advect, vectorField = array of vectors
export const applyLicToPicture = (input: Float32Array, vectorField: Float32Array, width: number, height: number, L = 10) => {
  const output = fillPicture(new Float32Array(input.length), 0, 0, 0, 1);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const curve = computeIntegralCurve(vectorField, width, height, i + 0.5, j + 0.5, L);

      // 1-d convolution per channel
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      for (let k = 0; k < curve.length; k += 2) {
        const x = Math.trunc(curve[k]);
        const y = Math.trunc(curve[k + 1]);
        const idx = (x + y * width) * 4;
        sumR += input[idx + 0];
        sumG += input[idx + 1];
        sumB += input[idx + 2];
      }
      sumR /= curve.length;
      sumG /= curve.length;
      sumB /= curve.length;

      const idx = (i + j * width) * 4;
      output[idx + 0] = sumR;
      output[idx + 1] = sumG;
      output[idx + 2] = sumB;
      output[idx + 3] = input[idx + 3];
    }
  }
  return normalizeBuffer(output, width, height);
};

const computeIntegralCurve = (vectorField: Float32Array, width: number, height: number, x0: number, y0: number, L: number, ds = 0.5) => {
  const streamline = [ x0, y0 ];

  let x = x0;
  let y = y0;

  // forward
  for (let i = 0; i < L; i++) {
    const idx = (Math.trunc(x) + Math.trunc(y) * width) * 2;
    const vx = vectorField[idx + 0];
    const vy = vectorField[idx + 1];

    x += vx * ds;
    y += vy * ds;
    if (x < 0 || x >= width || y < 0 || y >= height) {
      break;
    }

    streamline.push(x, y);
  }

  x = x0;
  y = y0;
  
  // backward
  for (let i = 0; i < L; i++) {
    const idx = (Math.trunc(x) + Math.trunc(y) * width) * 2;
    const vx = vectorField[idx + 0];
    const vy = vectorField[idx + 1];

    x -= vx * ds;
    y -= vy * ds;
    if (x < 0 || x >= width || y < 0 || y >= height) {
      break;
    }

    streamline.unshift(x, y);
  }

  return streamline;
};
