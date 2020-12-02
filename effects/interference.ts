import { normalizeBuffer } from '../utils/picture';
import { randomInteger, DefaultNormalDistribution } from '../utils/random';
import { makeValueNoise } from '../noise/valueNoise';
import { mirror } from './mirror';
import { refract } from './refract';
import { upscale2, UpscaleSamplers } from '../utils/upscale';
import { blendCosine } from '../utils/blend';
import { uniformMask } from '../utils/mask';


export const applyInterference = (input: Float32Array, width: number, height: number, distortionTileSize = 2, refractInput = true) => {
  // builds a distortion gradient with consistent symmetry
  let distortion = makeValueNoise(distortionTileSize, distortionTileSize, distortionTileSize, distortionTileSize, UpscaleSamplers.Bicubic, DefaultNormalDistribution, true);
  normalizeBuffer(distortion, distortionTileSize, distortionTileSize);
  distortion = mirror(distortion, distortionTileSize, distortionTileSize, true, true);
  distortion = upscale2(distortion, distortionTileSize * 2, distortionTileSize * 2, width, height, UpscaleSamplers.Bicubic);

  // create a scan noise (alternated white and black noise)
  const scanNoiseHeight = randomInteger(32, 128);
  let scanNoise = new Float32Array(width * scanNoiseHeight * 4);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      scanNoise[idx + 0] = j % 2 === 0 ? 0 : 1;
      scanNoise[idx + 1] = j % 2 === 0 ? 0 : 1;
      scanNoise[idx + 2] = j % 2 === 0 ? 0 : 1;
      scanNoise[idx + 3] = 1;
    }
  }
  scanNoise = upscale2(scanNoise, width, scanNoiseHeight, width, height, UpscaleSamplers.NearestNeighbor);

  // distort the scan noise and the input picture using the distortion gradient
  const distortedScanNoise = refract(scanNoise, distortion, width, height, 1);

  let distortedInput = input;
  if (refractInput) {
    distortedInput = refract(input, distortion, width, height, 1);
  }

  // merge the distorted scan noise with the distorted picture
  // 1 - (1 - distortedInput[idx + 0]) * distortedScanNoise[idx + 0];
  return blendCosine(distortedInput, distortedScanNoise, uniformMask(0.3, width, height), width, height);
};
