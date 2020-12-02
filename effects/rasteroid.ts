import { randomInteger, random } from '../utils/random';
import { euclidean } from '../utils/distance';
import { applyWarp } from './warp';
import { UpscaleSamplers } from '../utils/upscale';
import { applySobelDerivative } from './derivative';
import { applyCrt } from './crt';
import { applyScanlineError } from './scanlineError';

export const applyRasteroid = (input: Float32Array, width: number, height: number, distance = euclidean) => {
  const warpFreq = randomInteger(3, 5);
  const warpOctaves = randomInteger(3, 5);
  const warpDisplacement = 0.25 + random() * 0.125;
  let output = applyWarp(input, width, height, warpFreq, warpOctaves, warpDisplacement, UpscaleSamplers.NearestNeighbor);

  output = applySobelDerivative(output, width, height, distance);

  output = applyScanlineError(output, width, height);
  output = applyCrt(output, width, height);
  return output;
};
