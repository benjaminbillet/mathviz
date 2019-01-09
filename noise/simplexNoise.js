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


let permutations = shuffleArray([ 151, 160, 137, 91, 90, 15,
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
permutations = new Uint8Array(permutations.concat(permutations));


const F = (Math.sqrt(2 + 1) - 1) / 2;
const G = (1 - 1 / Math.sqrt(2 + 1)) / 2;


const hash = (x, y) => {
  const hashX = x & 255;
  const hashY = y & 255;
  return permutations[hashX + permutations[hashY]];
};


export const simplex = (x, y, gradients = DefaultGradients) => {
  const s = (x + y) * F;

  // instead of assigning random gradient on a square grid, we want to use a simplex grid (simplex = equilateral triangle)
  // we then skew our grid to transform our square grid into a rhombus grid (each rhombus consisting of two simplexes) and find in which i,j simplex we are
  // https://imgprx.livejournal.net/564666cefb989f329a8dcdb4088dd11254c07d50/yJZu8RRTbpvRzPLe20vOSgKT7WCDvoNe7frRwpC3RyqGU6Nv-UCBN1JR4I56low1pt1BdWG-CPbsfclg3YHU7DNci51qUqWp21XDQoiM11c
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);

  const t = (i + j) * G;

  // the x,y distances from the cell origin (i-t and j-t are unskewed i,j coordinates)
  const x0 = x - (i - t);
  const y0 = y - (j - t);

  // in 2D, the simplex is an equilateral triangle: i1,j1 will be the second (middle) cordoner of the simplex in i,j coordinates
  let i1 = null;
  let j1 = null;
  if (x0 > y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    i1 = 1;
    j1 = 0;
  } else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    i1 = 0;
    j1 = 1;
  }

  // a step of (1,0) in (i,j) means a step of (1-G,-G) in (x,y)
  // a step of (0,1) in (i,j) means a step of (-G,1-G) in (x,y)

  // offsets for middle corner in (x,y) unskewed coords
  const x1 = x0 - i1 + G;
  const y1 = y0 - j1 + G;
  // offsets for last corner in (x,y) unskewed coords
  const x2 = x0 - 1 + 2 * G;
  const y2 = y0 - 1 + 2 * G;

  // get the gradient for each simplex vertices
  const i00 = hash(i, j) % (gradients.length / 2);
  const x00 = gradients[i00 * 2];
  const y00 = gradients[i00 * 2 + 1];

  const i01 = hash(i + i1, j + j1) % (gradients.length / 2);
  const x01 = gradients[i01 * 2];
  const y01 = gradients[i01 * 2 + 1];

  const i11 = hash(i + 1, j + 1) % (gradients.length / 2);
  const x11 = gradients[i11 * 2];
  const y11 = gradients[i11 * 2 + 1];

  let n0 = 0;
  let n1 = 0;
  let n2 = 0;

  // calculate the contribution from the three corners
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    n0 = t0 * t0 * dot2(x00, y00, x0, y0);
  }
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    n1 = t1 * t1 * dot2(x01, y01, x1, y1);
  }
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    n2 = t2 * t2 * dot2(x11, y11, x2, y2);
  }
  // add contributions from each corner to get the final noise value
  // the result is scaled to return values in the interval [-1,1]
  return 70 * (n0 + n1 + n2);
};

// http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// https://kristiannielsen.livejournal.com/18962.html
// https://thebookofshaders.com/11/
export const makeSimplexNoise = (width, height, frequency = 32) => {
  frequency = clampInt(frequency, 1, Math.min(width, height) / 2);

  const buffer = new Float32Array(width * height * 4);
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    const intensity = simplex(i * frequency / width, j * frequency / height);
    buffer[idx + 0] = intensity;
    buffer[idx + 1] = intensity;
    buffer[idx + 2] = intensity;
  });
  normalizeBuffer(buffer, width, height);
  return buffer;
};


const DefaultPostProcess = intensity => intensity;
const DefaultPreProcess = coords => {};

export const makeSimplexNoise2 = (width, height, preprocessFunc = null, postprocessFunc = null, gradients = DefaultGradients) => {
  preprocessFunc = preprocessFunc || DefaultPreProcess;
  postprocessFunc = postprocessFunc || DefaultPostProcess;

  const coords = new Float32Array(2);
  const buffer = new Float32Array(width * height * 4);
  forEachPixel(buffer, width, height, (r, g, b, a, i, j, idx) => {
    coords[0] = i / width;
    coords[1] = j / height;

    preprocessFunc(coords);
    let intensity = simplex(coords[0], coords[1], gradients);
    intensity = postprocessFunc(intensity, coords);

    buffer[idx + 0] = intensity;
    buffer[idx + 1] = intensity;
    buffer[idx + 2] = intensity;
  });
  normalizeBuffer(buffer, width, height);
  return buffer;
};
