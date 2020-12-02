import sharp from 'sharp';
import { mkdirs } from '../../utils/fs';
import { setRandomSeed } from '../../utils/random';
import { plotRandomLayeredMultiScaleGridTiles } from '../../tiling/square-tile';
import { makeWingedSmithTiles, WINGED_SMITH_TILE_SIZE } from '../../tiling/tiles/winged-smith';
import { makeWingedCarlsonTiles } from '../../tiling/tiles/winged-carlson';
import { makeSvgDocument, saveSvgToFile } from '../../utils/canvas-svg';
import { Palette } from '../../utils/types';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/tiling`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlot = async (path: string, gridWidth: number, gridHeight: number, tileSize: number, tileGenerator = makeWingedSmithTiles) => {
  const document = makeSvgDocument();
  document.viewbox(0, 0, gridWidth * tileSize, gridHeight * tileSize);
  document.attr({ width: 3000, height: 3000, style: 'background-color: #000' });

  const palette: Palette = [[ 0.11, 0, 0.11, 1 ], [ 0.02, 0.6, 1, 1 ]];

  setRandomSeed('dioptase'); // make sure that all images have the same randomness sequence
  plotRandomLayeredMultiScaleGridTiles(gridWidth, gridHeight, 4, tileSize, tileGenerator, palette, document);

  // and save the image as svg
  saveSvgToFile(document, `${path}.svg`);

  // and finally convert the svg to a png
  await sharp(`${path}.svg`)
    .png()
    .flatten({ background: { r: 0, g: 0, b: 0 } })
    .toFile(path);
};

buildAndPlot(`${OUTPUT_DIRECTORY}/truchet-smith-multiscale.png`, 10, 10, WINGED_SMITH_TILE_SIZE, makeWingedSmithTiles);
buildAndPlot(`${OUTPUT_DIRECTORY}/truchet-carlson-multiscale.png`, 10, 10, WINGED_SMITH_TILE_SIZE, makeWingedCarlsonTiles);
