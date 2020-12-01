import { PixelPlotter } from '../../utils/types';
import { SvgDocument, makeSvgCanvas } from '../../utils/canvas-svg';

export const HEXAGON_RADIUS = 12;

export const makeStateStyles = (scale: number, doc: SvgDocument): PixelPlotter[] => {
  const canvas = makeSvgCanvas(doc, scale);
  return [
    (x, y, color) => canvas.drawFilledNgon(6, x, y, HEXAGON_RADIUS, color),
    (x, y, color) => canvas.drawFilledNgon(6, x, y, Math.round(2/3 * HEXAGON_RADIUS), color),
    (x, y, color) => canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color),
    (x, y, color) => canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color),
    (x, y, color) => canvas.drawNgon(6, x, y, Math.round(2/3 * HEXAGON_RADIUS), 1, color),
    (x, y, color) => canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color),
    (x, y, color) => canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color),
    (x, y, color) => canvas.drawNgon(6, x, y, Math.round(2/3 * HEXAGON_RADIUS), 2, color),
    (x, y, color) => canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 4, color),
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 2), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 2), 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 4), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 2), 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 4), 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 6), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawFilledNgon(6, x, y, (HEXAGON_RADIUS - 2), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 2), 1, color);
      canvas.drawFilledNgon(6, x, y, (HEXAGON_RADIUS - 4), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 2), 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 4), 1, color);
      canvas.drawFilledNgon(6, x, y, (HEXAGON_RADIUS - 6), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 2), 1, color);
      canvas.drawFilledNgon(6, x, y, (HEXAGON_RADIUS - 4), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 2), 1, color);
      canvas.drawNgon(6, x, y, (HEXAGON_RADIUS - 4), 1, color);
      canvas.drawFilledNgon(6, x, y, (HEXAGON_RADIUS - 6), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 2, 2, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 2, 2, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 6, 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 2, 2, color);
      canvas.drawFilledNgon(6, x, y, HEXAGON_RADIUS - 6, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 4, 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 4, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 4, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 1, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 2, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 1, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 1, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) - 1, 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawFilledNgon(6, x, y, HEXAGON_RADIUS - 4, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(2/3 * HEXAGON_RADIUS), 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },  
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 2, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 2, 1, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 6, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(2/3 * HEXAGON_RADIUS), 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },  
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 2, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 2, 1, color);
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS - 6, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 2, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 3, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 3, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 3, color);
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 4, 2, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 4, 2, color);
    },
    (x, y, color) => {
      canvas.drawFilledNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 4, 3, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 4, 2, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 4, 2, color);
      canvas.drawFilledNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3), color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 4, 2, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3), 1, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, HEXAGON_RADIUS, 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 2, 1, color);
      canvas.drawNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3) + 4, 2, color);
      canvas.drawFilledNgon(6, x, y, Math.round(HEXAGON_RADIUS / 3), color);
    },
    (x, y, color) => {
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 3, 1, color);
    },
    (x, y, color) => {
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 4, 2, color);
    },
    (x, y, color) => {
      canvas.drawFilledNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS), color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 5, 2, color);
    },
    (x, y, color) => {
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) - 1, 1, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 2, 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/3 * HEXAGON_RADIUS) + 5, 2, color);
    },
    (x, y, color) => {
      canvas.drawFilledNgon(6, x, y, Math.round(1/4 * HEXAGON_RADIUS), color);
      canvas.drawNgon(6, x, y, Math.round(1/4 * HEXAGON_RADIUS) + 2, 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/4 * HEXAGON_RADIUS) + 5, 2, color);
      canvas.drawNgon(6, x, y, Math.round(1/4 * HEXAGON_RADIUS) + 8, 2, color);
    },
  ];
};

