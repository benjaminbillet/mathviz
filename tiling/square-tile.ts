import TreeModel from 'tree-model';
import { SvgDocument } from '../utils/canvas-svg';
import { random, randomInteger } from '../utils/random';
import { Color, Palette, PixelPlotter } from '../utils/types';


const tree = new TreeModel();

export const plotSquareTiles = (grid: Float32Array, gridWidth: number, gridHeight: number, tileSize: number, tilePlotters: PixelPlotter[]) => {
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      const value = grid[i + j * gridWidth];
      const tile = tilePlotters[value];
      tile(i * tileSize, j * tileSize, [1, 1, 1, 1]);
    }
  }
};

export const plotRandomSquareTiles = (gridWidth: number, gridHeight: number, tileSize: number, tilePlotters: PixelPlotter[]) => {
  const grid = new Float32Array(gridWidth * gridHeight).fill(0).map(() => randomInteger(0, tilePlotters.length));
  return plotSquareTiles(grid, gridWidth, gridHeight, tileSize, tilePlotters);
};

const subdivide = (currentScale: number, nbScales: number, tileSize: number, node: TreeModel.Node<MultiscaleTile>) => {
  const probability = 1 / Math.pow(2, currentScale);
  const subTileSize = tileSize / Math.pow(2, currentScale - 1);
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const child = tree.parse({
        scale: currentScale,
        x: node.model.x + i * subTileSize, 
        y: node.model.y + j * subTileSize
      });
      if (currentScale < nbScales && random() < probability) {
        subdivide(currentScale + 1, nbScales, tileSize, child);
      }
      node.addChild(child);
    }
  }
};

export type TileGenerator = (scale: number, backgroundColor: Color, foregroundColor: Color, doc: SvgDocument) => PixelPlotter[];
type MultiscaleTile = { x: number, y: number, scale: number };

// https://christophercarlson.com/portfolio/multi-scale-truchet-patterns
// http://archive.bridgesmathart.org/2018/bridges2018-39.html
export const plotRandomLayeredMultiScaleGridTiles = (gridWidth: number, gridHeight: number, nbScales: number, tileSize: number, tileMaker: TileGenerator, palette: Palette, plotter: PixelPlotter) => {
  const tilePlotters = new Array(nbScales).fill(null).map((_, i) => {
    let backgroundColor = palette[0];
    let foregroundColor = palette[1];
    if (i % 2 === 1) {
      backgroundColor = palette[1];
      foregroundColor = palette[0];
    }
    const scale = 1 / Math.pow(2, i);
    return tileMaker(scale, backgroundColor, foregroundColor, plotter);
  });

  const root = tree.parse({});

  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      const child = root.addChild(tree.parse({ x: i * tileSize, y: j * tileSize, scale: 1 }));
      if (nbScales > 1 && random() < 0.5) {
        subdivide(2, nbScales, tileSize, child);
      }
    }
  }

  root.walk({strategy: 'breadth'}, (node) => {
    if (node.model.scale == null) {
      return true;
    }
    if (!node.hasChildren()) {
      const plotters = tilePlotters[node.model.scale - 1];
      const value = randomInteger(0, plotters.length);
      const tile = plotters[value];
      tile(node.model.x, node.model.y, [1, 1, 1, 1]); // color is not used
    }
    return true;
  });
};

