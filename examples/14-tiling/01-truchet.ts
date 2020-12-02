import sharp from 'sharp';
import { mkdirs } from '../../utils/fs';
import { setRandomSeed } from '../../utils/random';
import { makeSvgDocument, saveSvgToFile } from '../../utils/canvas-svg';
import { makeTruchetTiles, TRUCHET_TILE_SIZE } from '../../tiling/tiles/truchet';
import { plotRandomSquareTiles } from '../../tiling/square-tile';
import { makeTruchetSmithTiles, TRUCHET_SMITH_TILE_SIZE } from '../../tiling/tiles/smith';
import { KRAWCZYK_PATHS_TILE_SIZE, makeKrawczykPathsTiles } from '../../tiling/tiles/krawczyk-paths';
import { makeWingedCarlsonTiles, WINGED_CARLSON_TILE_SIZE } from '../../tiling/tiles/winged-carlson';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/tiling`;
mkdirs(OUTPUT_DIRECTORY);

const buildAndPlot = async (path: string, gridWidth: number, gridHeight: number, tileSize: number, tileGenerator = makeTruchetSmithTiles) => {
  const document = makeSvgDocument();
  document.viewbox(0, 0, gridWidth * tileSize, gridHeight * tileSize);
  document.attr({ width: 3000, height: 3000, style: 'background-color: #000' });

  const tilePlotters = tileGenerator(1, document);

  setRandomSeed('dioptase'); // make sure that all images have the same randomness sequence
  plotRandomSquareTiles(gridWidth, gridHeight, tileSize, tilePlotters);

  // and save the image as svg
  saveSvgToFile(document, `${path}.svg`)

  // and finally convert the svg to a png
  await sharp(`${path}.svg`)
    .png()
    .flatten({ background: { r: 0, g: 0, b: 0 } })
    .toFile(path);
};

buildAndPlot(`${OUTPUT_DIRECTORY}/truchet.png`, 50, 50, TRUCHET_TILE_SIZE, makeTruchetTiles);
buildAndPlot(`${OUTPUT_DIRECTORY}/truchet-smith.png`, 50, 50, TRUCHET_SMITH_TILE_SIZE, makeTruchetSmithTiles);
buildAndPlot(`${OUTPUT_DIRECTORY}/truchet-krawczyk.png`, 50, 50, KRAWCZYK_PATHS_TILE_SIZE, makeKrawczykPathsTiles);
buildAndPlot(`${OUTPUT_DIRECTORY}/truchet-carlson.png`, 50, 50, WINGED_CARLSON_TILE_SIZE, (scale, plotter) => makeWingedCarlsonTiles(scale, [0,0,0,1], [1,1,1,1], plotter));
