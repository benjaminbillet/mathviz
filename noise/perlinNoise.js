import { normalizeBuffer, forEachPixel } from '../utils/picture';
import { dot2 } from '../utils/vector';
import { shuffleArray, clampInt } from '../utils/misc';

export const DefaultGradients = new Int8Array([
  1, 1,
  -1, 1,
  1, 0,
  -1, 0,
  0, 1,
  0, -1,
]);

let PERMUTATIONS;

export const resetPerlinSeed = () => {
  PERMUTATIONS = shuffleArray([ 151, 160, 137, 91, 90, 15,
    131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
    190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
    102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
    5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
    223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
    251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
    49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180 ]);
  PERMUTATIONS = new Uint8Array(PERMUTATIONS.concat(PERMUTATIONS));
};

const quinticInterpolate = (x) => {
  const x3 = x * x * x;
  const x4 = x3 * x;
  const x5 = x4 * x;
  return 6 * x5 - 15 * x4 + 10 * x3;
};

const linearInterpolate = (a, b, g) => {
  return (1 - g) * a + g * b;
};

const hash = (x, y) => {
  if (PERMUTATIONS == null) {
    resetPerlinSeed();
  }
  const hashX = x & 255;
  const hashY = y & 255;
  return PERMUTATIONS[hashX + PERMUTATIONS[hashY]];
};

// output [-1, 1]
export const perlin = (x, y, gradients = DefaultGradients) => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const i00 = hash(x0, y0) % (gradients.length / 2);
  const x00 = gradients[i00 * 2];
  const y00 = gradients[i00 * 2 + 1];

  const i10 = hash(x1, y0) % (gradients.length / 2);
  const x10 = gradients[i10 * 2];
  const y10 = gradients[i10 * 2 + 1];

  const i01 = hash(x0, y1) % (gradients.length / 2);
  const x01 = gradients[i01 * 2];
  const y01 = gradients[i01 * 2 + 1];

  const i11 = hash(x1, y1) % (gradients.length / 2);
  const x11 = gradients[i11 * 2];
  const y11 = gradients[i11 * 2 + 1];

  // vectors from gradients to point in unit square
  const vx00 = x - x0;
  const vy00 = y - y0;
  const vx10 = x - x1;
  const vy10 = y - y0;
  const vx01 = x - x0;
  const vy01 = y - y1;
  const vx11 = x - x1;
  const vy11 = y - y1;

  // contribution of gradient vectors by dot product between relative vectors and gradients
  const d00 = dot2(x00, y00, vx00, vy00);
  const d10 = dot2(x10, y10, vx10, vy10);
  const d01 = dot2(x01, y01, vx01, vy01);
  const d11 = dot2(x11, y11, vx11, vy11);

  // interpolate dot product values at sample point using polynomial interpolation 6x^5 - 15x^4 + 10x^3
  const wx = quinticInterpolate(x - x0);
  const wy = quinticInterpolate(y - y0);

  // interpolate along x and y (bilinear interpolation) for the contributions from each of the gradients
  const xa = linearInterpolate(d00, d10, wx);
  const xb = linearInterpolate(d01, d11, wx);
  const val = linearInterpolate(xa, xb, wy);

  return val;
};

// https://github.com/Entalpi/Procedural-Noise/blob/master/noise.hpp
// http://eastfarthing.com/blog/2015-04-21-noise
// https://flafla2.github.io/2014/08/09/perlinnoise.html
export const makePerlinNoise = (width, height, frequency = 32) => {
  frequency = clampInt(frequency, 1, Math.min(width, height) / 2);
  const noiseFunc = makePerlinNoiseFunction(frequency);

  const buffer = new Float32Array(width * height * 4);
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    const intensity = noiseFunc(i / width, j / height);
    buffer[idx + 0] = intensity;
    buffer[idx + 1] = intensity;
    buffer[idx + 2] = intensity;
  });
  normalizeBuffer(buffer, width, height);
  return buffer;
};

export const makePerlinNoiseFunction = (frequency = 32) => {
  return (x, y) => perlin(x * frequency, y * frequency);
};

export const DefaultPostProcess = intensity => intensity;
export const DefaultPreProcess = coords => { };

export const makePerlinNoise2 = (width, height, preprocessFunc = null, postprocessFunc = null, gradients = DefaultGradients) => {
  preprocessFunc = preprocessFunc || DefaultPreProcess;
  postprocessFunc = postprocessFunc || DefaultPostProcess;

  const noiseFunc = makePerlinNoiseFunction2(preprocessFunc, postprocessFunc, gradients);
  const buffer = new Float32Array(width * height * 4);
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    const intensity = noiseFunc(i / width, j / height);
    buffer[idx + 0] = intensity;
    buffer[idx + 1] = intensity;
    buffer[idx + 2] = intensity;
  });
  normalizeBuffer(buffer, width, height);
  return buffer;
};

export const makePerlinNoiseFunction2 = (preprocessFunc = null, postprocessFunc = null, gradients = DefaultGradients) => {
  const coords = new Float32Array(2);
  return (x, y) => {
    coords[0] = x;
    coords[1] = y;

    preprocessFunc(coords);
    const intensity = perlin(coords[0], coords[1], gradients);
    return postprocessFunc(intensity, coords);
  };
};
