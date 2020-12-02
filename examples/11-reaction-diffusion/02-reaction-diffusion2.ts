import { mkdirs } from '../../utils/fs';
import { ReactionDiffusionGrid } from '../../utils/types';
import { plotReactionDiffusion2D } from '../../automata/reaction-diffusion/2d-reaction-diffusion';
import { GrayScottParams, GrayScottState, GRAY_SCOTT_KERNEL, makeAdvancedGrayScott } from '../../automata/reaction-diffusion/gray-scott';
import { saveImageBuffer } from '../../utils/picture';
import { randomInteger, setRandomSeed } from '../../utils/random';
import { euclidean2d, euclideanSquared } from '../../utils/distance';
import { linear } from '../../utils/interpolation';
import { clamp } from '../../utils/misc';
import { makePlotter } from '../../utils/plotter';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/reaction-diffusion`;
mkdirs(OUTPUT_DIRECTORY);

const width = 1000;
const height = 1000;

const buildAndPlotGrayScott = (width: number, height: number, getParams: (x: number, y: number) => GrayScottParams, iterations = 100, suffix = '') => {
  const path = `${OUTPUT_DIRECTORY}/grayscott-variations${suffix}.png`;

  const nextState = makeAdvancedGrayScott(getParams);

  // we create a random initial state
  const initialState: ReactionDiffusionGrid<GrayScottState> = new Array(width * height).fill({ a: 1, b: 0 });

  setRandomSeed('dioptase');

  const radius = 5;
  const diameter = radius * 2;
  const bound = radius * 3;
  for (let u = 0; u <= width / bound; u++) {
    for (let v = 0; v <= height / bound; v++) {
      const x = ((v % 2) * diameter) + u * bound + randomInteger(-diameter, diameter);
      const y = v * bound + randomInteger(-diameter, diameter);
      for (let i = -radius; i <= radius; i++) {
        for (let j = -radius; j <= radius; j++) {
          if (euclideanSquared(i / radius, j / radius) <= 1) {
            const idx = Math.trunc(clamp(x + i, 0, width)) + Math.trunc(clamp(y + j, 0, height)) * width;
            initialState[idx] = { a: 1, b: 1 };
          }
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

  saveImageBuffer(buffer, width, height, path);
};

const getParams1 = (x: number, y: number): GrayScottParams => {
  const k = linear(x / width, 0.045, 0.07);
  const f = linear(y / height, 0.01, 0.1);
  return { f, k, da: 1, db: 0.5, diffusionKernel: GRAY_SCOTT_KERNEL };
};

const getParams2 = (x: number, y: number, ): GrayScottParams => {
  const db = linear(clamp(euclidean2d(x, y, width/2, height/2) / (width/2), 0, 1), 0.1, 0.55);
  const da = db * 2;
  return { f: 0.029, k: 0.057, da, db, diffusionKernel: GRAY_SCOTT_KERNEL };
};

const getParams3 = (x: number, y: number, ): GrayScottParams => {
  const db = linear(1 - clamp(euclidean2d(x, y, width/2, height/2) / (width/2), 0, 1), 0.1, 0.55);
  const da = db * 2;
  return { f: 0.029, k: 0.057, da, db, diffusionKernel: GRAY_SCOTT_KERNEL };
};

const getParams4 = (x: number, y: number, ): GrayScottParams => {
  const r = clamp(euclidean2d(x, y, width/2, height/2) / (width/2), 0, 1);

  const diffusionKernel = [ ...GRAY_SCOTT_KERNEL ];

  let x2 = (x - width / 2) / width;
  let y2 = (y - height / 2) / height;
  if (x2 !== 0 && y2 !== 0) {
    x2 = x2 / Math.abs(x2);
    y2 = y2 / Math.abs(y2);
    diffusionKernel[(x2 + 1) + (y2 + 1) * 3] *= (1 + r);
    diffusionKernel[(-x2 + 1) + (-y2 + 1) * 3] *= (1 - r);
  }

  return { f: 0.029, k: 0.057, da: 1, db: 0.5, diffusionKernel };
};


const kernel = [
  0.05,  0.05, 0.2,
  0.2,  -1,   0.2,
  0.2,  0.05, 0.05,
];
const getParams5 = (x: number, y: number, ): GrayScottParams => {
  return { f: 0.029, k: 0.057, da: 1, db: 0.5, diffusionKernel: kernel };
};


buildAndPlotGrayScott(width, height, getParams1, 3000, '-fk');
buildAndPlotGrayScott(width, height, getParams2, 3000, '-db1');
buildAndPlotGrayScott(width, height, getParams3, 3000, '-db2');
buildAndPlotGrayScott(width, height, getParams4, 3000, '-kern');
