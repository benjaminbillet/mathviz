import { normalizeBuffer } from '../utils/picture';
import { euclidean2d, euclidean } from '../utils/distance';
import { randomInteger } from '../utils/random';

const findDistanceToClosestPoint = (x, y, points, distance = euclidean2d, nth = 0) => {
  const nthPoints = new Uint32Array(nth + 1).fill(-1);
  let minDist = null;
  for (let i = 0; i < nth + 1; i++) {
    minDist = Number.MAX_SAFE_INTEGER;
    for (let j = 0; j < points.length; j += 2) {
      const dist = distance(x, y, points[j + 0], points[j + 1]);
      if (dist < minDist && nthPoints.indexOf(j) === -1) {
        minDist = dist;
        nthPoints[i] = j;
      }
    }
  }
  return minDist;
};

export const makeWorleyNoise = (width, height, distance = euclidean2d, density = 0.1, nth = 0) => {
  const buffer = new Float32Array(width * height * 4);

  const nbPoints = Math.trunc(Math.min(width, height) * density);
  const points = new Uint32Array(nbPoints * 2);
  for (let i = 0; i < points.length; i += 2) {
    points[i + 0] = randomInteger(0, width);
    points[i + 1] = randomInteger(0, height);
  }

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const intensity = findDistanceToClosestPoint(i, j, points, distance, nth);
      const idx = (i + j * width) * 4;
      buffer[idx + 0] = intensity;
      buffer[idx + 1] = intensity;
      buffer[idx + 2] = intensity;
      buffer[idx + 3] = 255;
    }
  }
  normalizeBuffer(buffer, width, height);
  return buffer;
};


export const makeWorleyLogSumNoise = (width, height, distance = euclidean, density = 0.1, minDistance = 0.01) => {
  const buffer = new Float32Array(width * height * 4);

  const nbPoints = Math.trunc(Math.min(width, height) * density);
  const points = new Uint32Array(nbPoints * 2);
  for (let i = 0; i < points.length; i += 2) {
    points[i + 0] = randomInteger(0, width);
    points[i + 1] = randomInteger(0, height);
  }

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      for (let k = 0; k < points.length; k += 2) {
        const x0 = i - points[k] - width / 2;
        const x1 = i - points[k] + width / 2;
        const y0 = j - points[k + 1] - height / 2;
        const y1 = j - points[k + 1] + height / 2;
        const x = Math.min(Math.abs(x0), Math.abs(x1));
        const y = Math.min(Math.abs(y0), Math.abs(y1));
        const intensity = Math.log(Math.max(distance(x, y), minDistance));
        buffer[idx + 0] += intensity;
        buffer[idx + 1] += intensity;
        buffer[idx + 2] += intensity;
        buffer[idx + 3] = 255;
      }
    }
  }
  normalizeBuffer(buffer, width, height);
  return buffer;
};
