// Chaos game methods enable to generate the attractor of an Iterated Function System, i.e., the set of values an IFS tends to evolve into.
// It is a sampling method which works as follow:

// 1. pick a point z₀
// 2. pick a function fᵢ in the IFS
// 3. apply fᵢ: zₖ₊₁ = fᵢ(zₖ)
// 4. plot zₖ₊₁ and return to step 2

import { complex } from '../utils/complex';

import { mapComplexDomainToPixel, mapDomainToPixel } from '../utils/picture';
import { randomIntegerWeighted } from '../utils/random';
import { pickColorMapValue, RainbowColormap } from '../utils/color';
import { Ifs, IterableComplexFunction, Optional, PlotDomain, Transform2D } from '../utils/types';
import { drawBresenhamLine } from '../utils/raster';
import { makePlotter } from '../utils/plotter';

export const simpleIfsChaosPlot = (buffer: Float32Array, hitmap: Uint32Array, width: number, height: number, ifs: Ifs, finalTransform: Optional<Transform2D>, domain: PlotDomain, iterations: number): Float32Array => {
  // we get the list of functions and the associated probabilities
  const { functions, probabilities } = ifs;

  // create a function that will return a number between 0 and probabilities.length - 1, with the given probabilities
  const randomInt = randomIntegerWeighted(probabilities);

  let zn = complex(0, 0); // z0

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
    const idx1 = (x + y * width);
    hitmap[idx1] += 1;

    const idx2 = idx1 * 4;
    buffer[idx2 + 0] = color[0];
    buffer[idx2 + 1] = color[1];
    buffer[idx2 + 2] = color[2];
    buffer[idx2 + 3] = color[3];
  }

  return buffer;
};

export const simpleWalkChaosPlot = (buffer: Float32Array, hitmap: Uint32Array, width: number, height: number, walk: IterableComplexFunction, finalTransform: Optional<Transform2D>, domain: PlotDomain, iterations: number): Float32Array => {
  let zn = null; // z0
  for (let i = 0; i < iterations; i++) {
    // at each iteration we get the next step of the random walk...
    zn = walk();

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
    const idx1 = (x + y * width);
    hitmap[idx1] += 1;

    const idx2 = idx1 * 4;
    buffer[idx2 + 0] = 1;
    buffer[idx2 + 1] = 1;
    buffer[idx2 + 2] = 1;
    buffer[idx2 + 3] = 1;
  }

  return buffer;
};

export const simpleWalkChaosLinePlot = (buffer: Float32Array, width: number, height: number, walk: IterableComplexFunction, domain: PlotDomain, iterations: number): Float32Array => {
  const plotter = makePlotter(buffer, width, height);
  let zn = walk(); // z0
  for (let i = 0; i < iterations; i++) {
    // at each iteration we get the next step of the random walk...
    const oldZn = zn;
    zn = walk();

    // ... then the destination is mapped to the pixel domain
    const p1 = mapComplexDomainToPixel(oldZn, domain, width, height);
    const p2 = mapComplexDomainToPixel(zn, domain, width, height);

    drawBresenhamLine(p1.re, p1.im, p2.re, p2.im, [1,1,1,1], plotter);
  }

  return buffer;
};

