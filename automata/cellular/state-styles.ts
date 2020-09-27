import { getScaledRaster } from '../../utils/svg-raster';
import { PixelPlotter } from '../../utils/types';

export const makeStateStyles = (baseSize: number, scale: number, plotter: PixelPlotter): PixelPlotter[] => {
  let raster = getScaledRaster(scale);
  return [
    (x, y, color) => raster.drawFilledNgon(6, x, y, baseSize, color, plotter),
    (x, y, color) => raster.drawFilledNgon(6, x, y, Math.round(2/3 * baseSize), color, plotter),
    (x, y, color) => raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter),
    (x, y, color) => raster.drawNgon(6, x, y, baseSize, 1, color, plotter),
    (x, y, color) => raster.drawNgon(6, x, y, Math.round(2/3 * baseSize), 1, color, plotter),
    (x, y, color) => raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter),
    (x, y, color) => raster.drawNgon(6, x, y, baseSize, 2, color, plotter),
    (x, y, color) => raster.drawNgon(6, x, y, Math.round(2/3 * baseSize), 2, color, plotter),
    (x, y, color) => raster.drawNgon(6, x, y, baseSize, 4, color, plotter),
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 2), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 2), 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 4), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 2), 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 4), 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 6), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, (baseSize - 2), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 2), 1, color, plotter);
      raster.drawFilledNgon(6, x, y, (baseSize - 4), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 2), 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 4), 1, color, plotter);
      raster.drawFilledNgon(6, x, y, (baseSize - 6), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, (baseSize - 2), 1, color, plotter);
      raster.drawFilledNgon(6, x, y, (baseSize - 4), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, (baseSize - 2), 1, color, plotter);
      raster.drawNgon(6, x, y, (baseSize - 4), 1, color, plotter);
      raster.drawFilledNgon(6, x, y, (baseSize - 6), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 2, 2, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 2, 2, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 6, 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 2, 2, color, plotter);
      raster.drawFilledNgon(6, x, y, baseSize - 6, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 2, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 4, 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 2, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 4, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 2, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 4, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 1, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 2, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 1, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 1, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) - 1, 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, baseSize - 4, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(2/3 * baseSize), 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },  
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 2, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 2, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 2, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 2, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 2, 1, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 6, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(2/3 * baseSize), 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },  
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 2, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 2, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 2, 1, color, plotter);
      raster.drawNgon(6, x, y, baseSize - 6, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize) + 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize) + 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 2, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 3, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 3, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 3, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 4, 2, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 4, 2, color, plotter);
    },
    (x, y, color) => {
      raster.drawFilledNgon(6, x, y, Math.round(baseSize / 3) + 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 4, 3, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 4, 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 4, 2, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(baseSize / 3), color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 4, 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3), 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, baseSize, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 2, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(baseSize / 3) + 4, 2, color, plotter);
      raster.drawFilledNgon(6, x, y, Math.round(baseSize / 3), color, plotter);
    },
    (x, y, color) => {
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize) + 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 3, 1, color, plotter);
    },
    (x, y, color) => {
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize) + 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 4, 2, color, plotter);
    },
    (x, y, color) => {
      raster.drawFilledNgon(6, x, y, Math.round(1/3 * baseSize), color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 2, 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 5, 2, color, plotter);
    },
    (x, y, color) => {
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) - 1, 1, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 2, 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/3 * baseSize) + 5, 2, color, plotter);
    },
    (x, y, color) => {
      raster.drawFilledNgon(6, x, y, Math.round(1/4 * baseSize), color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/4 * baseSize) + 2, 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/4 * baseSize) + 5, 2, color, plotter);
      raster.drawNgon(6, x, y, Math.round(1/4 * baseSize) + 8, 2, color, plotter);
    },
  ];
};

