import sharp from 'sharp';
import { mkdirs } from '../utils/fs';
import { reduceVonNeumannHexagonalNeighbor } from '../automata/cellular/neighborhood';
import { makeSvgCanvas, saveCanvasToFile } from '../utils/svg-raster';
import { plot2dAutomaton } from '../automata/cellular/2d-automaton';

import { makeStateStyles } from '../automata/cellular/state-styles';
import { ICE, getBigQualitativePalette, expandPalette, BLUE_MOON, BOAT, SKY, PURPLE_MAGIC } from '../utils/palette';
import { shuffleArray } from '../utils/misc';
import { CellularAutomataGrid, Color, ComplexPlotter, NextCellStateFunction, Optional, PixelPlotter } from '../utils/types';
import { setRandomSeed } from '../utils/random';


const OUTPUT_DIRECTORY = `${__dirname}/../output/cellular`;
mkdirs(OUTPUT_DIRECTORY);

setRandomSeed(100);

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


const buildAndPlotMultistateCA = async (path: string, width: number, height: number, iterations = 10) => {
  // 0 = dead cell (uncolored), 1 = alive cell (colored)
  const colors: Color[] = [
    [ 0, 0, 0 ],
    ...expandPalette(SKY.map(c => c.map(x => x / 255)), 63)
  ];
  // we create an initial state, with a living cell at the center
  const initialState = new Uint8Array(width * height).fill(0);
  initialState[Math.trunc(width / 2) + Math.trunc(height / 2) * width] = 1;

  // plot the cellular automaton
  await plot2dHexCA(path, width, height, 3000, 3000, nextCellState, colors, iterations, initialState, 12, 2, 3, 0);
};

buildAndPlotMultistateCA(`${OUTPUT_DIRECTORY}/multistate-ca.png`, 75, 75, 35);
