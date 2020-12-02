import { SvgDocument, makeSvgCanvas, SvgCanvas } from '../../utils/canvas-svg';
import { Color, PixelPlotter } from '../../utils/types';

export const WINGED_SMITH_TILE_SIZE = 12;

const drawCommon = (canvas: SvgCanvas, x: number, y: number, scaledTileSize: number, backgroundColor: Color, foregroundColor: Color) => {
  canvas.drawFilledCircle(x, y, WINGED_SMITH_TILE_SIZE / 3, backgroundColor);
  canvas.drawFilledCircle(x, y + scaledTileSize, WINGED_SMITH_TILE_SIZE / 3, backgroundColor);
  canvas.drawFilledCircle(x + scaledTileSize, y, WINGED_SMITH_TILE_SIZE / 3, backgroundColor);
  canvas.drawFilledCircle(x + scaledTileSize, y + scaledTileSize, WINGED_SMITH_TILE_SIZE / 3, backgroundColor);

  canvas.drawFilledCircle(x + scaledTileSize / 2, y, WINGED_SMITH_TILE_SIZE / 6, foregroundColor);
  canvas.drawFilledCircle(x, y + scaledTileSize  / 2, WINGED_SMITH_TILE_SIZE / 6, foregroundColor);
  canvas.drawFilledCircle(x + scaledTileSize / 2, y + scaledTileSize, WINGED_SMITH_TILE_SIZE / 6, foregroundColor);
  canvas.drawFilledCircle(x + scaledTileSize, y + scaledTileSize / 2, WINGED_SMITH_TILE_SIZE / 6, foregroundColor);
};

export const makeWingedSmithTiles = (scale: number, backgroundColor: Color, foregroundColor: Color, doc: SvgDocument): PixelPlotter[] => {
  const canvas = makeSvgCanvas(doc, scale);
  const scaledTileSize = WINGED_SMITH_TILE_SIZE * scale;
  const tileRadius = WINGED_SMITH_TILE_SIZE / 2;
  const stroke = WINGED_SMITH_TILE_SIZE / 3;

  return [
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x, y, tileRadius, 0, Math.PI / 2, foregroundColor, stroke);
      canvas.drawArc(x + scaledTileSize, y + scaledTileSize, tileRadius, Math.PI, -Math.PI / 2, foregroundColor, stroke);

      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x, y + scaledTileSize, tileRadius, -Math.PI / 2, 0, foregroundColor, stroke);
      canvas.drawArc(x + scaledTileSize, y , tileRadius, Math.PI / 2, Math.PI, foregroundColor, stroke);

      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    }
  ];
};

