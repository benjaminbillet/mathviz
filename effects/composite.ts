import { downscale2, DownscaleSamplers } from '../utils/downscale';
import { PlotBuffer } from '../utils/types';
import { upscale2, UpscaleSamplers } from '../utils/upscale';


export const applyComposite = (input: PlotBuffer, width: number, height: number, scale = 2) => {
  const filterWidth = 4;
  const filterHeight = 4;
  const channelFilter = [
    1, 0, 0,    0, 1, 0,    0, 0, 1,    0, 0, 0,
    1, 0, 0,    0, 1, 0,    0, 0, 1,    0, 0, 0,
    1, 0, 0,    0, 1, 0,    0, 0, 1,    0, 0, 0,
    0, 0, 0,    0, 0, 0,    0, 0, 0,    0, 0, 0,
  ];

  let output = null;
  const scaledWidth = Math.round(width / scale);
  const scaledHeight = Math.round(height / scale);
  if (scale > 1) {
    output = downscale2(input, width, height, scaledWidth, scaledHeight);
  } else {
    output = upscale2(input, width, height, scaledWidth, scaledHeight);
  }

  const quarterWidth = Math.round((width / scale) / 4);
  const quarterHeight = Math.round((height / scale) / 4);

  output = downscale2(output, scaledWidth, scaledHeight, quarterWidth, quarterHeight, DownscaleSamplers.NearestNeighbor);
  output = upscale2(output, quarterWidth, quarterHeight, scaledWidth, scaledHeight, UpscaleSamplers.NearestNeighbor);

  for (let i = 0; i < scaledWidth; i += filterWidth) {
    for (let j = 0; j < scaledHeight; j += filterHeight) {
      for (let k = 0; k < filterWidth; k++) {
        for (let l = 0; l < filterHeight; l++) {
          const idx = (i + k + (j + l) * scaledWidth) * 4;
          const fidx = (k + l * filterWidth) * 3;
          if (i + k < scaledWidth && j + l < scaledHeight) {
            output[idx + 0] *= channelFilter[fidx + 0];
            output[idx + 1] *= channelFilter[fidx + 1];
            output[idx + 2] *= channelFilter[fidx + 2];
          }
        }
      }
    }
  }

  if (scale > 1) {
    output = upscale2(output, scaledWidth, scaledHeight, width, height, UpscaleSamplers.NearestNeighbor);
  } else {
    output = downscale2(output, scaledWidth, scaledHeight, width, height, DownscaleSamplers.NearestNeighbor);
  }

  return output;
};
