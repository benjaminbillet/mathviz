import { forEachPixel } from './picture';
import { chebyshev2d } from './distance';
import { distanceCenterMask } from './mask';
import { cosine, linear } from './interpolation';

export const blendCosine = (buffer1, buffer2, gradientBuffer, width, height, gradFactor = 1) => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(gradientBuffer, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = cosine(r * gradFactor, buffer1[idx + 0], buffer2[idx + 0]);
    output[idx + 1] = cosine(g * gradFactor, buffer1[idx + 1], buffer2[idx + 1]);
    output[idx + 2] = cosine(b * gradFactor, buffer1[idx + 2], buffer2[idx + 2]);
    output[idx + 3] = a;

    /* output[idx + 0] = (1 - Math.cos(r * gradFactor * Math.PI)) / 2;
    output[idx + 1] = (1 - Math.cos(g * gradFactor * Math.PI)) / 2;
    output[idx + 2] = (1 - Math.cos(b * gradFactor * Math.PI)) / 2;
    output[idx + 3] = a;

    output[idx + 0] = buffer1[idx + 0] * (1 - output[idx + 0]) + buffer2[idx + 0] * output[idx + 0];
    output[idx + 1] = buffer1[idx + 1] * (1 - output[idx + 1]) + buffer2[idx + 1] * output[idx + 1];
    output[idx + 2] = buffer1[idx + 2] * (1 - output[idx + 2]) + buffer2[idx + 2] * output[idx + 2];*/
  });
  return output;
};

export const blendCosineCenter = (buffer1, buffer2, width, height, distanceFunc = chebyshev2d, gradFactor = 1) => {
  const mask = distanceCenterMask(distanceFunc, width, height, 4);
  return blendCosine(buffer1, buffer2, mask, width, height, gradFactor);
};

export const blendLinear = (buffer1, buffer2, gradientBuffer, width, height, gradFactor = 1) => {
  const output = new Float32Array(width * height * 4);
  forEachPixel(gradientBuffer, width, height, (r, g, b, a, i, j, idx) => {
    output[idx + 0] = linear(r * gradFactor, buffer1[idx + 0], buffer2[idx + 0]);
    output[idx + 1] = linear(g * gradFactor, buffer1[idx + 1], buffer2[idx + 1]);
    output[idx + 2] = linear(b * gradFactor, buffer1[idx + 2], buffer2[idx + 2]);
    output[idx + 3] = a;

    /* output[idx + 0] = r * gradFactor;
    output[idx + 1] = g * gradFactor;
    output[idx + 2] = b * gradFactor;
    output[idx + 3] = a;

    output[idx + 0] = buffer1[idx + 0] * (1 - output[idx + 0]) + buffer2[idx + 0] * output[idx + 0];
    output[idx + 1] = buffer1[idx + 1] * (1 - output[idx + 1]) + buffer2[idx + 1] * output[idx + 1];
    output[idx + 2] = buffer1[idx + 2] * (1 - output[idx + 2]) + buffer2[idx + 2] * output[idx + 2];*/
  });
  return output;
};

export const blendLinearCenter = (buffer1, buffer2, width, height, distanceFunc = chebyshev2d, gradFactor = 1) => {
  const mask = distanceCenterMask(distanceFunc, width, height, 4);
  return blendLinear(buffer1, buffer2, mask, width, height, gradFactor);
};
