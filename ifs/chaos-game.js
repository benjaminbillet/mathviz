// Chaos game methods enable to generate the attractor of an Iterated Function System, i.e., the set of values an IFS tends to evolve into.
// It is a sampling method which works as follow:

// 1. pick a point z₀
// 2. pick a function fᵢ in the IFS
// 3. apply fᵢ: zₖ₊₁ = fᵢ(zₖ)
// 4. plot zₖ₊₁ and return to step 2

import Complex from 'complex.js';

import { mapDomainToPixel } from '../utils/picture';
import { randomIntegerWeighted } from '../utils/random';
import { pickColorMapValue, RainbowColormap } from '../utils/color';

export const simpleIfsChaosPlot = (buffer, width, height, ifs, finalTransform, domain, iterations) => {
  // we get the list of functions and the associated probabilities
  const { functions, probabilities } = ifs;

  // create a function that will return a number between 0 and probabilities.length - 1, with the given probabilities
  const randomInt = randomIntegerWeighted(probabilities);

  let zn = new Complex(0, 0); // z0

  for (let i = 0; i < iterations; i++) {
    // at each iteration we apply one of the function...
    const selected = randomInt();
    const f = functions[selected];
    zn = f(zn);

    // ... we apply an optional final transform that will not be part of the iteration...
    let finalZ = zn;
    if (finalTransform) {
      finalZ = finalTransform(zn);
    }

    // ... then the transformed value is mapped to the pixel domain
    const [ x, y ] = mapDomainToPixel(finalZ.re, finalZ.im, domain, width, height);

    // pixels that are outside the image are discarded
    if (x < 0 || y < 0 || x >= width || y >= height) {
      continue;
    }

    // we apply a different color to the point, depending on which function is selected
    const color = pickColorMapValue(selected / functions.length, RainbowColormap);

    // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
    const idx = (x + y * width) * 4;
    buffer[idx + 0] = color[0];
    buffer[idx + 1] = color[1];
    buffer[idx + 2] = color[2];
    buffer[idx + 3] = 255;
  }

  return buffer;
};

export const simpleWalkChaosPlot = (buffer, width, height, walk, finalTransform, domain, iterations) => {
  let zn = null; // z0
  for (let i = 0; i < iterations; i++) {
    // at each iteration we get the next step of the random walk...
    zn = walk(zn);

    // ... we apply an optional final transform that will not be part of the walk...
    let finalZ = zn;
    if (finalTransform) {
      finalZ = finalTransform(zn);
    }

    // ... then the destination is mapped to the pixel domain
    const [ x, y ] = mapDomainToPixel(finalZ.re, finalZ.im, domain, width, height);

    // pixels that are outside the image are discarded
    if (x < 0 || y < 0 || x >= width || y >= height) {
      continue;
    }

    // the buffer is 1-dimensional and each pixel has 4 components (r, g, b, a)
    const idx = (x + y * width) * 4;
    buffer[idx + 0] = 255;
    buffer[idx + 1] = 255;
    buffer[idx + 2] = 255;
    buffer[idx + 3] = 255;
  }

  return buffer;
};
