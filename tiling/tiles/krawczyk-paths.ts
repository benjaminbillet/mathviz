import { SvgDocument, makeSvgCanvas } from '../../utils/canvas-svg';
import { PixelPlotter } from '../../utils/types';

// https://mypages.iit.edu/~krawczyk/rjkisama11.pdf

export const KRAWCZYK_PATHS_TILE_SIZE = 12;

export const makeKrawczykPathsTiles = (scale: number, doc: SvgDocument): PixelPlotter[] => {
  const canvas = makeSvgCanvas(doc, scale);

  const scaledSize = KRAWCZYK_PATHS_TILE_SIZE * scale;
  return [
    (x, y, color) => {
      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);
      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 2, 0, Math.PI / 2, color, 1);
      canvas.drawArc(x, y, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, 0, Math.PI / 2, color, 1);

      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);
      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI / 2, Math.PI - Math.PI / 4, color, 1);
      canvas.drawArc(x + scaledSize, y, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, Math.PI / 2, Math.PI - Math.PI / 4 - 0.05, color, 1);

      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, -Math.PI / 2, 0, color, 1);
      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, -Math.PI / 2 + Math.PI / 4, 0, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);
      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI / 2, Math.PI, color, 1);
      canvas.drawArc(x + scaledSize, y, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, Math.PI / 2, Math.PI, color, 1);

      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI, 3 * Math.PI / 2 - Math.PI / 4, color, 1);
      canvas.drawArc(x + scaledSize, y + scaledSize, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, Math.PI, 3 * Math.PI / 2 - Math.PI / 4 - 0.05, color, 1);

      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);
      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI / 4, Math.PI / 2, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + scaledSize, y + scaledSize, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, Math.PI, 3 * Math.PI / 2, color, 1);

      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, 3 * Math.PI / 2, 0, color, 1);
      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, 3 * Math.PI / 2, - Math.PI / 4, color, 1);
      canvas.drawArc(x, y + scaledSize, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, 3 * Math.PI / 2, - Math.PI / 4 - 0.05, color, 1);

      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);
      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI / 2 + Math.PI / 4, Math.PI, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, 3 * Math.PI / 2, 0, color, 1);
      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, 3 * Math.PI / 2, 0, color, 1);
      canvas.drawArc(x, y + scaledSize, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, 3 * Math.PI / 2, 0, color, 1);

      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);
      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 2, 0, Math.PI / 2 - Math.PI / 4, color, 1);
      canvas.drawArc(x, y, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, 0, Math.PI / 2 - Math.PI / 4 - 0.05, color, 1);

      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI + Math.PI / 4, 3 * Math.PI / 2, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);
      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 2, 0, Math.PI / 2, color, 1);
      canvas.drawArc(x, y, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, 0, Math.PI / 2, color, 1);

      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);

      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, -Math.PI / 2, 0, color, 1);

      canvas.drawArc(x + 5/8 * scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, -Math.PI, 0, color, 1);
      canvas.drawArc(x + scaledSize, y + 5/8 * scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, Math.PI / 2, 3 * Math.PI / 2, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);
      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI / 2, Math.PI, color, 1);
      canvas.drawArc(x + scaledSize, y, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, Math.PI / 2, Math.PI, color, 1);

      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, 3 * Math.PI / 2, color, 1);

      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);

      canvas.drawArc(x, y + 5/8 * scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, -Math.PI / 2, Math.PI / 2, color, 1);
      canvas.drawArc(x + 3/8 * scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, Math.PI, 0, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + scaledSize, y + scaledSize, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, Math.PI, 3 * Math.PI / 2, color, 1);

      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, 3 * Math.PI / 2, 0, color, 1);

      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);

      canvas.drawArc(x + 3/8 * scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 8, 0, Math.PI, color, 1);
      canvas.drawArc(x, y + 3/8 * scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, 3 * Math.PI / 2, Math.PI / 2, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, 3 * Math.PI / 2, 0, color, 1);
      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, 3 * Math.PI / 2, 0, color, 1);
      canvas.drawArc(x, y + scaledSize, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, 3 * Math.PI / 2, 0, color, 1);

      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);

      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, 3 * Math.PI / 2, color, 1);

      canvas.drawArc(x + scaledSize, y + 3/8 * scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, Math.PI / 2, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + 5/8 * scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 8, 0, Math.PI, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);
      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 2, 0, Math.PI / 2, color, 1);
      canvas.drawArc(x, y, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, 0, Math.PI / 2, color, 1);

      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);

      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, -Math.PI / 2, 0, color, 1);

      canvas.drawArc(x + 5/8 * scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, -Math.PI, 0, color, 1);
      canvas.drawArc(x + scaledSize, y + 5/8 * scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, Math.PI / 2, 3 * Math.PI / 2, color, 1);

      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, -Math.PI / 2, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);
      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI / 2, Math.PI, color, 1);
      canvas.drawArc(x + scaledSize, y, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, Math.PI / 2, Math.PI, color, 1);

      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, 3 * Math.PI / 2, color, 1);

      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);

      canvas.drawArc(x, y + 5/8 * scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, -Math.PI / 2, Math.PI / 2, color, 1);
      canvas.drawArc(x + 3/8 * scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, Math.PI, 0, color, 1);

      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, 3 * Math.PI / 2, 0, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, Math.PI, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + scaledSize, y + scaledSize, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, Math.PI, 3 * Math.PI / 2, color, 1);

      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, 3 * Math.PI / 2, 0, color, 1);

      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);

      canvas.drawArc(x + 3/8 * scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 8, 0, Math.PI, color, 1);
      canvas.drawArc(x, y + 3/8 * scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, 3 * Math.PI / 2, Math.PI / 2, color, 1);

      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, 3 * Math.PI / 2, 0, color, 1);
      canvas.drawArc(x, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 2, 3 * Math.PI / 2, 0, color, 1);
      canvas.drawArc(x, y + scaledSize, 3 / 4 * KRAWCZYK_PATHS_TILE_SIZE, 3 * Math.PI / 2, 0, color, 1);

      canvas.drawArc(x, y, KRAWCZYK_PATHS_TILE_SIZE / 4, 0, Math.PI / 2, color, 1);

      canvas.drawArc(x + scaledSize, y + scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI, 3 * Math.PI / 2, color, 1);

      canvas.drawArc(x + scaledSize, y + 3/8 * scaledSize, KRAWCZYK_PATHS_TILE_SIZE / 8, Math.PI / 2, 3 * Math.PI / 2, color, 1);
      canvas.drawArc(x + 5/8 * scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 8, 0, Math.PI, color, 1);

      canvas.drawArc(x + scaledSize, y, KRAWCZYK_PATHS_TILE_SIZE / 4, Math.PI / 2, Math.PI, color, 1);
    },
  ];
};

