import { mkdirs } from '../../utils/fs';
import { ReactionDiffusionGrid } from '../../utils/types';
import { plotReactionDiffusion2D } from '../../automata/reaction-diffusion/2d-reaction-diffusion';
import { GrayScottState, makeGrayScott } from '../../automata/reaction-diffusion/gray-scott';
import { saveImageBuffer } from '../../utils/picture';
import { randomInteger, setRandomSeed } from '../../utils/random';
import { normal3, normalize3 } from '../../utils/vector';
import { clamp } from '../../utils/misc';
import { blinnSpecular, gaussianSpecular, phongSpecular } from '../../utils/illumination';
import { convolve, makeGaussianKernel } from '../../utils/convolution';
import { euclideanSquared } from '../../utils/distance';
import { makePlotter } from '../../utils/plotter';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/reaction-diffusion`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed('dioptase');

const computeNormals = (buffer: Float32Array, width: number, height: number) => {
  const normals = new Float32Array(width * height * 3).fill(0);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      // we consider a polygon being made of 4 pixels (x = width, y = height, z = luminance * width)
      const inIdx1 = (i + j * width) * 4;
      const inIdx2 = (i + 1 + j * width) * 4;
      const inIdx3 = (i + (j + 1) * width) * 4;
      const outIdx = (i + j * width) * 3;

      const normal = normal3(i, j, buffer[inIdx1] * width, i + 1, j, buffer[inIdx2] * width, i, j + 1, buffer[inIdx3] * width);

      normals[outIdx + 0] = normal[0];
      normals[outIdx + 1] = normal[1];
      normals[outIdx + 2] = normal[2];
    }
  }
  return normals;
};

const illuminate = (input: Float32Array, normals: Float32Array, viewDirection: number[], lightDirection: number[], width: number, height: number, specularFunction = phongSpecular) => {
  const output = new Float32Array(width * height * 4).fill(1);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const normIdx = (i + j * width) * 3;
      const normal = [ normals[normIdx + 0], normals[normIdx + 1], normals[normIdx + 2] ];

      const specular = specularFunction(normal, viewDirection, lightDirection);

      const imgIdx = (i + j * width) * 4;
      output[imgIdx + 0] = clamp(specular + input[imgIdx + 0], 0, 1);
      output[imgIdx + 1] = clamp(specular + input[imgIdx + 1], 0, 1);
      output[imgIdx + 2] = clamp(specular + input[imgIdx + 2], 0, 1);
      output[imgIdx + 3] = 1;
    }
  }
  return output;
};

const illuminateSmooth = (input: Float32Array, normals: Float32Array, viewDirection: number[], lightDirection: number[], width: number, height: number, specularFunction = phongSpecular) => {
  let specularBuffer = new Float32Array(width * height * 4).fill(1);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const normIdx = (i + j * width) * 3;
      const normal = [ normals[normIdx + 0], normals[normIdx + 1], normals[normIdx + 2] ];

      const specular = specularFunction(normal, viewDirection, lightDirection);

      const imgIdx = (i + j * width) * 4;
      specularBuffer[imgIdx + 0] = specular;
      specularBuffer[imgIdx + 1] = specular;
      specularBuffer[imgIdx + 2] = specular;
      specularBuffer[imgIdx + 3] = 1;
    }
  }

  specularBuffer = convolve(specularBuffer, new Float32Array(width * height * 4), width, height, makeGaussianKernel(3));

  const output = new Float32Array(width * height * 4).fill(1);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const imgIdx = (i + j * width) * 4;
      output[imgIdx + 0] = clamp(specularBuffer[imgIdx + 0] + input[imgIdx + 0], 0, 1);
      output[imgIdx + 1] = clamp(specularBuffer[imgIdx + 1] + input[imgIdx + 1], 0, 1);
      output[imgIdx + 2] = clamp(specularBuffer[imgIdx + 2] + input[imgIdx + 2], 0, 1);
      output[imgIdx + 3] = 1;
    }
  }
  return output;
};

const saveNormalBuffer = (normals: Float32Array, width: number, height: number, path: string) => {
  const out = new Float32Array(width * height * 4).fill(1);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const inIdx = (i + j * width) * 3;
      const outIdx = (i + j * width) * 4;
      out[outIdx + 0] = (1 + normals[inIdx + 0]) / 2;
      out[outIdx + 1] = (1 + normals[inIdx + 1]) / 2;
      out[outIdx + 2] = (1 + normals[inIdx + 2]) / 2;
      out[outIdx + 3] = 1;
    }
  }
  saveImageBuffer(out, width, height, path);
};

const buildAndPlotIlluminatedGrayScott = (width: number, height: number, f: number, k: number, da: number, db: number, iterations = 100, sources = 50, name = '') => {
  const nextState = makeGrayScott(f, k, da, db);

  // we create a random initial state
  const initialState: ReactionDiffusionGrid<GrayScottState> = new Array(width * height).fill({ a: 1, b: 0 });

  setRandomSeed('dioptase'); // make sure that all images have the same randomness sequence
  for (let u = 0; u < sources; u++) {
    const radius = randomInteger(10, 20);
    const x = randomInteger(radius * 2, width - radius * 2);
    const y = randomInteger(radius * 2, height - radius * 2);
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        if (euclideanSquared(i / radius, j / radius) <= 1) {
          const idx = Math.trunc(clamp(x + i, 0, width)) + Math.trunc(clamp(y + j, 0, height)) * width;
          initialState[idx] = { a: 1, b: 1 };
        }
      }
    }
  }

  // we create a buffer for drawing
  const buffer = new Float32Array(width * height * 4);
  const plotter = makePlotter(buffer, width, height);

  const renderState = (x: number, y: number, state: GrayScottState) => {
    plotter(x, y, [ state.b, state.b, state.b, 1 ]);
  };
  plotReactionDiffusion2D(renderState, width, height, nextState, (x, y) => initialState[x + y * width], iterations);

  // we use the grayscale image as a basis for illumination
  const lightDirection = normalize3(1, 1, 1);
  const viewDirection = normalize3(1, 1, 1);

  const normals = computeNormals(buffer, width, height);
  saveNormalBuffer(normals, width, height, `${OUTPUT_DIRECTORY}/grayscott-normals${name}-f=${f}-k=${k}-da=${da}-db=${db}.png`)

  const phongSpeculars = illuminate(buffer, normals, viewDirection, lightDirection, width, height, phongSpecular);
  const blinnSpeculars = illuminate(buffer, normals, viewDirection, lightDirection, width, height, blinnSpecular);
  const gaussianSpeculars = illuminate(buffer, normals, viewDirection, lightDirection, width, height, gaussianSpecular);

  let path = `${OUTPUT_DIRECTORY}/grayscott-phong${name}-f=${f}-k=${k}-da=${da}-db=${db}.png`;
  saveImageBuffer(phongSpeculars, width, height, path);

  path = `${OUTPUT_DIRECTORY}/grayscott-blinn${name}-f=${f}-k=${k}-da=${da}-db=${db}.png`;
  saveImageBuffer(blinnSpeculars, width, height, path);

  path = `${OUTPUT_DIRECTORY}/grayscott-gaussian${name}-f=${f}-k=${k}-da=${da}-db=${db}.png`;
  saveImageBuffer(gaussianSpeculars, width, height, path);

  const phongSmoothSpeculars = illuminateSmooth(buffer, normals, viewDirection, lightDirection, width, height, phongSpecular);

  path = `${OUTPUT_DIRECTORY}/grayscott-phongsmooth${name}-f=${f}-k=${k}-da=${da}-db=${db}.png`;
  saveImageBuffer(phongSmoothSpeculars, width, height, path);
};

buildAndPlotIlluminatedGrayScott(500, 500, 0.03, 0.057, 1, 0.5, 2000, 50, '-theta');
buildAndPlotIlluminatedGrayScott(500, 500, 0.058, 0.065, 1, 0.5, 2000, 100, '-mu');
buildAndPlotIlluminatedGrayScott(500, 500, 0.062, 0.061, 1, 0.5, 2000, 100, '-pi');
buildAndPlotIlluminatedGrayScott(500, 500, 0.09, 0.059, 1, 0.5, 2000, 100, '-rho');