import * as D3Color from 'd3-color';
import { randomScalar, random, setRandomSeed, randomInteger, pickRandom } from '../utils/random';
import { saveImageBuffer, forEachPixel } from '../utils/picture';
import { RUBY, FOREST, SKY, BLUE_MOON } from '../utils/palette';
import { convertUnitToRGBA } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { drawBresenhamLine } from '../utils/bresenham';
import { makeQuadraticBezier } from '../utils/curve';
import { complex } from '../utils/complex';
import { substract } from '../utils/binarymorph';
import { clamp } from '../utils/misc';
import { euclidean2d } from '../utils/distance';
import { makeColormapColorizer, makeTintColorizer, makeShadeColorizer, makeShadeTintColorizer } from '../utils/colorizer';

const OUTPUT_DIRECTORY = `${__dirname}/../output/agate`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed(100);

const drawBezier = (p0, p1, p2, plot, resolution = 0.001) => {
  const bezier = makeQuadraticBezier(p0, p1, p2);
  let previousPoint = null;
  let point = null;
  for (let i = 0; i < 1; i += resolution) {
    point = bezier(i);
    if (previousPoint != null) {
      drawBresenhamLine(previousPoint.re, previousPoint.im, point.re, point.im, plot);
    }
    previousPoint = point;
  };
};


const fillShape = (shape, width, height, x, y) => {
  const pixelsToTest = [];
  pixelsToTest.push((x + y * width) * 4);

  while (pixelsToTest.length > 0) {
    const length = pixelsToTest.length;
    for (let i = 0; i < length; i++) {
      const idx = pixelsToTest.pop();
      if (idx >= 0 && idx < shape.length && shape[idx] === 0) {
        shape[idx + 0] = 1;
        shape[idx + 1] = 1;
        shape[idx + 2] = 1;
        pixelsToTest.push(idx + 4);
        pixelsToTest.push(idx - 4);
        pixelsToTest.push(idx + 4 * width);
        pixelsToTest.push(idx - 4 * width);
      }
    }
  }
};

const makeSampledPlotter = (buffer, width, height, samples, nbSamples) => {
  let count = 0;
  return (x, y) => {
    x = Math.round(x);
    y = Math.round(y);

    const idx = (x * width + y) * 4;
    buffer[idx + 0] = 1;
    buffer[idx + 1] = 1;
    buffer[idx + 2] = 1;

    // use reservoir sampling to pick random points
    count++;
    if (samples.length < nbSamples) {
      samples.push({ x, y, radius: nucleationSizeDistribution() });
    } else {
      const r = randomInteger(0, count);
      if (r < samples.length) {
        samples[r] = { x, y, radius: nucleationSizeDistribution() };
      }
    }
  };
};

const buildAgateMatrix = (width, height, nbShapePoints, nbNucleationPoints, matrixJitterDistribution, nucleationSizeDistribution) => {
  const mask = new Uint8Array(width * height * 4);

  const nucleationPoints = [];
  const plot = makeSampledPlotter(mask, width, height, nucleationPoints, nbNucleationPoints);

  // build the points of the shape
  const delta = Math.PI / nbShapePoints;
  const angles = new Array(nbShapePoints).fill(0).map((_, i) => {
    const angle = i / nbShapePoints * 2 * Math.PI;
    const jitter = (random() + 1 - 2) * delta;
    return angle + jitter;
  });
  angles.push(angles[0]); // close the shape

  const xRadius = width / 2 * 0.95; // width / randomInteger(10, 20);
  const yRadius = height / 2 * 0.95; // height / randomInteger(10, 20);
  const centerX = Math.trunc(width / 2);
  const centerY = Math.trunc(height / 2);

  let previous = null;
  for (let i = 0; i < angles.length; i++) {
    const angle = angles[i];
    const x = centerX + Math.cos(angle) * xRadius;
    const y = centerY + Math.sin(angle) * yRadius;

    if (previous != null) {
      let delta = angle - previous.angle;
      if (delta < 0) {
        delta = 2 * Math.PI + delta;
      }

      const radiusjitter = matrixJitterDistribution();
      const angleJitterX = randomScalar(0.7, 1.5);
      const angleJitterY = randomScalar(0.7, 1.5);
      const px = centerX + Math.cos(angle - delta * angleJitterX / 2) * xRadius * radiusjitter;
      const py = centerY + Math.sin(angle - delta * angleJitterY / 2) * yRadius * radiusjitter;

      drawBezier(complex(previous.x, previous.y), complex(px, py), complex(x, y), plot);
    }

    previous = { x, y, angle };
  }

  fillShape(mask, width, height, centerX, centerY);
  return { nucleationPoints, mask };
};


const introduceNewNucleationPoints = (width, height, nucleationPoints, potentialPoints, nbDots, nucleationSizeDistribution, power) => {
  const newNucleationPoints = [];

  const centerX = width / 2;
  const centerY = height / 2;
  for (let i = 0; i < nbDots; i++) {
    const potentialPoint = pickRandom(potentialPoints);
    const radius = nucleationSizeDistribution();

    const distance = euclidean2d(centerX, centerY, potentialPoint[0], potentialPoint[1]);
    const jump = Math.min(radius + randomInteger(0, 2 * radius * power), distance / 1.25) / distance;
    const x = (centerX - potentialPoint[0]) * jump + potentialPoint[0];
    const y = (centerY - potentialPoint[1]) * jump + potentialPoint[1];

    if (x >= 0 && y >= 0 && x < width && y < height) {
      newNucleationPoints.push({ x: Math.round(x), y: Math.round(y), radius });
    }
  }

  return [
    ...nucleationPoints,
    ...newNucleationPoints,
  ];
};

const makeColorizer = (palette) => {
  let iterations = 0;
  let iterationsPerColor = 0;
  let color = pickRandom(palette);
  let currentColor = D3Color.rgb(...color);
  return () => {
    if (iterations > 0) {
      if (iterationsPerColor > 5 && random() < 0.1) {
        color = pickRandom(palette);
        currentColor = D3Color.rgb(...color);
        iterationsPerColor = 0;
      } else {
        const hsl = D3Color.hsl(currentColor);
        hsl.h = (hsl.h + randomInteger(0, 5)) % 360;
        hsl.s = clamp((hsl.s * 100 - randomInteger(-5, 5)) / 100, 0.25, 0.75);
        hsl.l = clamp((hsl.l * 100 - randomInteger(-10, 10)) / 100, 0.25, 0.75);

        currentColor = D3Color.rgb(hsl);
        iterationsPerColor++;
      }
    }
    iterations++;
    return [ currentColor.r / 255, currentColor.g / 255, currentColor.b / 255 ];
  };
};

const generateAgate = (
  path,
  width,
  height,
  nbMatrixPoints,
  matrixJitterDistribution,
  nbStartNucleations,
  nucleationSizeDistribution,
  newNucleationProbability,
  maxNewNucleationPerIteration,
  growDistribution,
  colorizer
) => {
  let { mask, nucleationPoints } = buildAgateMatrix(width, height, nbMatrixPoints, nbStartNucleations, matrixJitterDistribution, nucleationSizeDistribution);
  saveImageBuffer(convertUnitToRGBA(mask), width, height, `${path}-mask.png`);

  const growBuffer = new Uint8Array(width * height * 4);
  const growBufferPrev = new Uint8Array(growBuffer.length);
  const difference = new Uint8Array(growBuffer.length);
  const output = new Float32Array(growBuffer.length);

  let addedPoints = [];

  const nbIterations = 200;

  for (let i = 0; i < nbIterations; i++) {
    console.log('iteration:', i + 1, 'active nucleations:', nucleationPoints.length);
    const color = colorizer();

    nucleationPoints.forEach((circle) => {
      circle.oldRadiusSquared = circle.radiusSquared || 0;
      circle.radiusSquared = circle.radius * circle.radius;
    });

    // create new nucleation points
    if (i > 0 && random() < newNucleationProbability) {
      nucleationPoints = introduceNewNucleationPoints(width, height, nucleationPoints, addedPoints, maxNewNucleationPerIteration, nucleationSizeDistribution, 1);
    }

    // report generated pixels to the output
    substract(growBuffer, growBufferPrev, difference, width, height);
    forEachPixel(difference, width, height, (r, g, b, a, i, j, idx) => {
      if (r === 1) {
        output[idx + 0] = color[0];
        output[idx + 1] = color[1];
        output[idx + 2] = color[2];
      }
    });

    // save picture periodically
    if (i >= 20 && i % 10 === 0) {
      saveImageBuffer(convertUnitToRGBA(output), width, height, `${path}-${i+1}.png`);
    }

    // copy the current buffer to the previous one
    addedPoints = [];
    growBufferPrev.set(growBuffer);

    // draw
    nucleationPoints.forEach((circle, i) => {
      if (circle.radiusSquared == null) {
        return;
      }

      const x1 = clamp(circle.x - circle.radius, 0, width);
      const y1 = clamp(circle.y - circle.radius, 0, height);
      const x2 = clamp(circle.x + circle.radius, 0, width);
      const y2 = clamp(circle.y + circle.radius, 0, height);

      const nbPreviousPoints = addedPoints.length;
      for (let x = x1; x < x2; x++) {
        for (let y = y1; y < y2; y++) {
          const idx = (x * width + y) * 4;
          if (growBuffer[idx] === 0 && mask[idx] === 1) {
            const distance = (circle.x - x) * (circle.x - x) + (circle.y - y) * (circle.y - y);
            if (distance <= circle.radiusSquared && distance >= circle.oldRadiusSquared) {
              addedPoints.push([ x, y ]);
              growBuffer[idx + 0] = 1;
              growBuffer[idx + 1] = 1;
              growBuffer[idx + 2] = 1;
            }
          }
        }
      }

      // clip unused nucleation points
      if (nbPreviousPoints === addedPoints.length) {
        nucleationPoints[i] = null;
      }
    });
    nucleationPoints = nucleationPoints.filter(x => x != null);

    // no new pixels drawn, stop the generator
    if (addedPoints.length === 0) {
      break;
    }

    // grow the nucleation points
    const size = growDistribution();
    nucleationPoints.forEach((circle) => {
      circle.radius += size;
    });
  }

  saveImageBuffer(convertUnitToRGBA(output), width, height, `${path}-final.png`);
};


const newNucleationProbability = 0.75;
const maxNewNucleationPerIteration = 20;
const nucleationSizeDistribution = () => randomInteger(5, 15);
const nbStartNucleations = 75;
const nbMatrixPoints = 30;
const matrixJitterDistribution = () => randomScalar(0.9, 1.1);
const growDistribution = () => randomInteger(3, 10);

const width = 2048;
const height = 2048;

const colormapColorizer = makeColormapColorizer(BLUE_MOON, 1024);
const tintColorizer = makeTintColorizer(RUBY[2]);
const shadeColorizer = makeShadeColorizer(FOREST[2]);
const shadeTintColorizer = makeShadeTintColorizer(SKY[3]);

generateAgate(`${OUTPUT_DIRECTORY}/agate-colormap`, width, height, nbMatrixPoints, matrixJitterDistribution, nbStartNucleations, nucleationSizeDistribution, newNucleationProbability, maxNewNucleationPerIteration, growDistribution, colormapColorizer);
generateAgate(`${OUTPUT_DIRECTORY}/agate-tint`, width, height, nbMatrixPoints, matrixJitterDistribution, nbStartNucleations, nucleationSizeDistribution, newNucleationProbability, maxNewNucleationPerIteration, growDistribution, tintColorizer);
generateAgate(`${OUTPUT_DIRECTORY}/agate-shade`, width, height, nbMatrixPoints, matrixJitterDistribution, nbStartNucleations, nucleationSizeDistribution, newNucleationProbability, maxNewNucleationPerIteration, growDistribution, shadeColorizer);
generateAgate(`${OUTPUT_DIRECTORY}/agate-shadetint`, width, height, nbMatrixPoints, matrixJitterDistribution, nbStartNucleations, nucleationSizeDistribution, newNucleationProbability, maxNewNucleationPerIteration, growDistribution, shadeTintColorizer);
