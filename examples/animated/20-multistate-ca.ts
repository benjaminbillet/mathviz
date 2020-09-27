import sharp from 'sharp';
import { mkdirs } from '../../utils/fs';
import { reduceVonNeumannHexagonalNeighbor } from '../../automata/cellular/neighborhood';
import { plot2dAutomaton } from '../../automata/cellular/2d-automaton';
import { animateFunction } from './util';
import * as Easing from '../../utils/easing';
import { setRandomSeed } from '../../utils/random';
import { makeSvgCanvas, saveCanvasToFile } from '../../utils/svg-raster';
import { makeStateStyles } from '../../automata/cellular/state-styles';
import { shuffleArray } from '../../utils/misc';
import { ICE, getBigQualitativePalette, expandPalette, BLUE_MOON, BOAT, SKY, PURPLE_MAGIC } from '../../utils/palette';
import { CellularAutomataGrid, Color, ComplexPlotter, NextCellStateFunction, Optional, PixelPlotter, RenderFrameFunction } from '../../utils/types';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/animated-cellular`;
mkdirs(OUTPUT_DIRECTORY);



const plot2dHexCA = async (
  path: string,
  width: number,
  height: number,
  svgWidth: number,
  svgHeight: number,
  nextCellState: NextCellStateFunction,
  colors: Color[],
  iterations = 100,
  initialState?: Optional<CellularAutomataGrid>,
  hexagonalRadius = 12,
  hexagonBorder = 1,
  hexagonScale = 1,
  deadCellState?: Optional<number>,
) => {
  // we compute the size of the final buffer, according to ther hexagon size
  const hexagonalRadiusWithBorder = (hexagonalRadius + hexagonBorder) * hexagonScale;

  const w = Math.sqrt(3) * hexagonalRadiusWithBorder;
  const h = 2 * hexagonalRadiusWithBorder;

  const bufferWidth = Math.trunc(width * w);
  const bufferHeight = Math.trunc(height * h * 0.75);

  // the plotter is a SVG plotter
  const canvasPlotter = makeSvgCanvas();
  canvasPlotter.viewbox(0, 0, bufferWidth, bufferHeight);
  canvasPlotter.attr({ width: svgWidth, height: svgHeight, style: 'background-color: #000' });

  // for each state, we have a different shape drawing procedure
  setRandomSeed(1000); // make sure that the shuffle will be the same at each iteration
  const statePlotters: PixelPlotter[] = [
    () => {}, // state 0 = dead cell
    ...shuffleArray(makeStateStyles(hexagonalRadius, hexagonScale, canvasPlotter))
  ];

  // the final plotter encapsulates the base plotter with a logic for converting the hex grid coordinates to the buffer coordinates
  const skewness = (height * 0.5 * 0.5);
  let plotter: ComplexPlotter = (z, color, cellState) => {
    const x = Math.trunc((z.re - skewness) * w + z.im * w * 0.5);
    const y = Math.trunc(z.im * 0.75 * h);
    if (x >= 0 && x < bufferWidth && y >= 0 && y < bufferHeight) {
      statePlotters[cellState](x, y, color);
    }
  };

  const grid = plot2dAutomaton(plotter, width, height, nextCellState, colors, deadCellState, iterations, initialState);

  // and save the image as svg
  await saveCanvasToFile(canvasPlotter, `${path}.svg`)

  // and finally convert the svg to a png
  sharp(`${path}.svg`)
    .png()
    .flatten({ background: { r: 0, g: 0, b: 0 } })
    .toFile(path, (err, info) => { console.log(err, info); });

  return grid;
};

const nextCellState = (stateGrid: CellularAutomataGrid, gridWidth: number, gridHeight: number, currentState: number, x: number, y: number) => {
  const sum = reduceVonNeumannHexagonalNeighbor(stateGrid, gridWidth, gridHeight, x, y, 1, (total, neighborState) => {
    return total + neighborState;
  }, 0);
  if (sum >= 64) {
    return 0;
  }
  return sum;
  // return sum % 64;
};

export const makeAnimated = (width: number, height: number, outWidth: number, outHeight: number): RenderFrameFunction => {
  setRandomSeed(100);

  // 0 = dead cell (uncolored), 1 = alive cell (colored)
  const colors: Color[] = [
    [ 0, 0, 0 ],
    ...expandPalette(BOAT.map(c => c.map(x => x / 255)), 63)
  ];

  // every new call to the animation function will reuse the previous CA state
  let lastState = new Uint8Array(width * height).fill(0);
  lastState[Math.trunc(width / 2) + Math.trunc(height / 2) * width] = 1;

  return async (iterations, _, path) => {
    if (iterations === 0) {
      await plot2dHexCA(path, width, height, outWidth, outHeight, nextCellState, colors, 0, lastState, 12, 2, 3, 0);
    } else {
      lastState = await plot2dHexCA(path, width, height, outWidth, outHeight, nextCellState, colors, 1, lastState, 12, 2, 3, 0);
    }
  };
};

animateFunction(makeAnimated(34, 34, 2000, 2000), 0, 20, Easing.linear, 20, OUTPUT_DIRECTORY, 'multistate', 3);
