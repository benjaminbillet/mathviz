import { mkdirs } from '../utils/fs';
import { PlotBuffer, ReactionDiffusionGrid } from '../utils/types';
import { plotReactionDiffusion2D } from '../automata/reaction-diffusion/2d-reaction-diffusion';
import { GrayScottState, makeGrayScott } from '../automata/reaction-diffusion/gray-scott';
import { convertUnitToRGBA } from '../utils/color';
import { saveImageBuffer } from '../utils/picture';
import { makePixelToComplexPlotter, makeUnmappedBufferPlotter } from '../utils/plotter';
import { randomInteger, setRandomSeed } from '../utils/random';
import { euclideanSquared } from '../utils/distance';
import { clamp } from '../utils/misc';

const OUTPUT_DIRECTORY = `${__dirname}/../output/reaction-diffusion`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlotGrayScott = async (width: number, height: number, f: number, k: number, da: number, db: number, iterations = 100, sources = 50, name = '') => {
  const path = `${OUTPUT_DIRECTORY}/grayscott${name}-f=${f}-k=${k}-da=${da}-db=${db}.png`;

  const nextState = makeGrayScott(f, k, da, db);

  // we create a random initial state
  const initialState: ReactionDiffusionGrid<GrayScottState> = new Array(width * height).fill({ a: 1, b: 0 });

  setRandomSeed(100); // make sure that all images have the same randomness sequence
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
  let buffer: PlotBuffer = new Float32Array(width * height * 4);
  const plotter = makePixelToComplexPlotter(makeUnmappedBufferPlotter(buffer, width, height));

  const renderState = (x: number, y: number, state: GrayScottState) => {
    plotter(x, y, [ state.b, state.b, state.b, 1 ]);
  };
  plotReactionDiffusion2D(renderState, width, height, nextState, (x, y) => initialState[x + y * width], iterations);

  buffer = convertUnitToRGBA(buffer);
  await saveImageBuffer(buffer, width, height, path);
};


buildAndPlotGrayScott(500, 500, 0.037, 0.06, 1, 0.5, 2000, 100);
buildAndPlotGrayScott(500, 500, 0.03, 0.062, 1, 0.5, 2000, 100);
buildAndPlotGrayScott(500, 500, 0.031, 0.056, 1, 0.5, 2000, 100);
buildAndPlotGrayScott(500, 500, 0.029, 0.057, 1, 0.5, 2000, 100);
buildAndPlotGrayScott(500, 500, 0.039, 0.058, 1, 0.5, 2000, 100);

// http://mrob.com/pub/comp/xmorphia/pearson-classes.html
buildAndPlotGrayScott(500, 500, 0.01, 0.047, 1, 0.5, 1500, 50, '-alpha');
buildAndPlotGrayScott(500, 500, 0.026, 0.051, 1, 0.5, 2000, 50, '-beta');
buildAndPlotGrayScott(500, 500, 0.022, 0.051, 1, 0.5, 2000, 50, '-gamma');
buildAndPlotGrayScott(500, 500, 0.030, 0.055, 1, 0.5, 2000, 50, '-delta');
buildAndPlotGrayScott(500, 500, 0.018, 0.055, 1, 0.5, 2000, 50, '-epsilon');
buildAndPlotGrayScott(500, 500, 0.026, 0.059, 1, 0.5, 2000, 50, '-zeta');
buildAndPlotGrayScott(500, 500, 0.034, 0.063, 1, 0.5, 2000, 50, '-eta');
buildAndPlotGrayScott(500, 500, 0.03, 0.057, 1, 0.5, 2000, 50, '-theta');
buildAndPlotGrayScott(500, 500, 0.046, 0.0594, 1, 0.5, 2000, 50, '-iota');
buildAndPlotGrayScott(500, 500, 0.05, 0.063, 1, 0.5, 2000, 100, '-kappa');
buildAndPlotGrayScott(500, 500, 0.026, 0.061, 1, 0.5, 2000, 50, '-lambda');
buildAndPlotGrayScott(500, 500, 0.058, 0.065, 1, 0.5, 2000, 100, '-mu');
buildAndPlotGrayScott(500, 500, 0.082, 0.063, 1, 0.5, 1500, 100, '-nu');
buildAndPlotGrayScott(500, 500, 0.014, 0.047, 1, 0.5, 2000, 100, '-xi');
buildAndPlotGrayScott(500, 500, 0.062, 0.061, 1, 0.5, 2000, 100, '-pi');
buildAndPlotGrayScott(500, 500, 0.09, 0.059, 1, 0.5, 2000, 100, '-rho');
buildAndPlotGrayScott(500, 500, 0.11, 0.0523, 1, 0.5, 3000, 100, '-sigma');
