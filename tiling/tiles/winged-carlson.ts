import { Color, PixelPlotter } from '../../utils/types';
import { SvgDocument, makeSvgCanvas, SvgCanvas } from '../../utils/canvas-svg';

export const WINGED_CARLSON_TILE_SIZE = 12;

const drawCommon = (canvas: SvgCanvas, x: number, y: number, scaledTileSize: number, backgroundColor: Color, foregroundColor: Color) => {
  canvas.drawFilledCircle(x, y, WINGED_CARLSON_TILE_SIZE / 3, backgroundColor);
  canvas.drawFilledCircle(x, y + scaledTileSize, WINGED_CARLSON_TILE_SIZE / 3, backgroundColor);
  canvas.drawFilledCircle(x + scaledTileSize, y, WINGED_CARLSON_TILE_SIZE / 3, backgroundColor);
  canvas.drawFilledCircle(x + scaledTileSize, y + scaledTileSize, WINGED_CARLSON_TILE_SIZE / 3, backgroundColor);

  canvas.drawFilledCircle(x + scaledTileSize / 2, y, WINGED_CARLSON_TILE_SIZE / 6, foregroundColor);
  canvas.drawFilledCircle(x, y + scaledTileSize  / 2, WINGED_CARLSON_TILE_SIZE / 6, foregroundColor);
  canvas.drawFilledCircle(x + scaledTileSize / 2, y + scaledTileSize, WINGED_CARLSON_TILE_SIZE / 6, foregroundColor);
  canvas.drawFilledCircle(x + scaledTileSize, y + scaledTileSize / 2, WINGED_CARLSON_TILE_SIZE / 6, foregroundColor);
};

export const makeWingedCarlsonTiles = (scale: number, backgroundColor: Color, foregroundColor: Color, doc: SvgDocument): PixelPlotter[] => {
  const canvas = makeSvgCanvas(doc, scale);
  const scaledTileSize = WINGED_CARLSON_TILE_SIZE * scale;
  const tileRadius = WINGED_CARLSON_TILE_SIZE / 2;
  const stroke = WINGED_CARLSON_TILE_SIZE / 3;

  return [
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x, y, tileRadius, 0, Math.PI / 2, foregroundColor, stroke);
      canvas.drawArc(x + scaledTileSize, y + scaledTileSize, tileRadius, Math.PI, -Math.PI / 2, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x, y + scaledTileSize , tileRadius, -Math.PI / 2, 0, foregroundColor, stroke);
      canvas.drawArc(x + scaledTileSize, y , tileRadius, Math.PI / 2, Math.PI, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawLine(x, y + scaledTileSize / 2, x + scaledTileSize, y + scaledTileSize / 2, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawLine(x  + scaledTileSize / 2, y, x + scaledTileSize / 2, y + scaledTileSize, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x, y, tileRadius, 0, Math.PI / 2, foregroundColor, stroke);
      canvas.drawArc(x + scaledTileSize, y + scaledTileSize, tileRadius, Math.PI, -Math.PI / 2, foregroundColor, stroke);
      canvas.drawArc(x, y + scaledTileSize , tileRadius, -Math.PI / 2, 0, foregroundColor, stroke);
      canvas.drawArc(x + scaledTileSize, y , tileRadius, Math.PI / 2, Math.PI, foregroundColor, stroke);
      canvas.drawLine(x, y + scaledTileSize / 2, x + scaledTileSize, y + scaledTileSize / 2, foregroundColor, stroke);
      canvas.drawLine(x  + scaledTileSize / 2, y, x + scaledTileSize / 2, y + scaledTileSize, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawLine(x, y + scaledTileSize / 2, x + scaledTileSize, y + scaledTileSize / 2, foregroundColor, stroke);
      canvas.drawLine(x  + scaledTileSize / 2, y, x + scaledTileSize / 2, y + scaledTileSize, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x + scaledTileSize, y + scaledTileSize, tileRadius, Math.PI, -Math.PI / 2, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x + scaledTileSize, y , tileRadius, Math.PI / 2, Math.PI, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x, y, tileRadius, 0, Math.PI / 2, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x, y + scaledTileSize , tileRadius, -Math.PI / 2, 0, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x, y, tileRadius, 0, Math.PI / 2, foregroundColor, stroke);
      canvas.drawArc(x + scaledTileSize, y , tileRadius, Math.PI / 2, Math.PI, foregroundColor, stroke);
      canvas.drawLine(x, y + scaledTileSize / 2, x + scaledTileSize, y + scaledTileSize / 2, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x + scaledTileSize, y + scaledTileSize, tileRadius, Math.PI, -Math.PI / 2, foregroundColor, stroke);
      canvas.drawArc(x, y + scaledTileSize , tileRadius, -Math.PI / 2, 0, foregroundColor, stroke);
      canvas.drawLine(x, y + scaledTileSize / 2, x + scaledTileSize, y + scaledTileSize / 2, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x + scaledTileSize, y + scaledTileSize, tileRadius, Math.PI, -Math.PI / 2, foregroundColor, stroke);
      canvas.drawArc(x + scaledTileSize, y , tileRadius, Math.PI / 2, Math.PI, foregroundColor, stroke);
      canvas.drawLine(x  + scaledTileSize / 2, y, x + scaledTileSize / 2, y + scaledTileSize, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
    (x, y) => {
      canvas.drawFilledRectangle(x, y, scaledTileSize, scaledTileSize, backgroundColor);
      canvas.drawArc(x, y, tileRadius, 0, Math.PI / 2, foregroundColor, stroke);
      canvas.drawArc(x, y + scaledTileSize , tileRadius, -Math.PI / 2, 0, foregroundColor, stroke);
      canvas.drawLine(x  + scaledTileSize / 2, y, x + scaledTileSize / 2, y + scaledTileSize, foregroundColor, stroke);
      drawCommon(canvas, x, y, scaledTileSize, backgroundColor, foregroundColor);
    },
  ];
};
