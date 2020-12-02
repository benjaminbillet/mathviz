import { SvgDocument, makeSvgCanvas } from '../../utils/canvas-svg';
import { PixelPlotter } from '../../utils/types';

export const TRUCHET_SMITH_TILE_SIZE = 12;

export const makeTruchetSmithTiles = (scale: number, doc: SvgDocument): PixelPlotter[] => {
  const canvas = makeSvgCanvas(doc, scale);
  
  const size = TRUCHET_SMITH_TILE_SIZE * scale;
  const radius = TRUCHET_SMITH_TILE_SIZE / 2;
  return [
    (x, y, color) => {
      canvas.drawArc(x, y, radius, 0, Math.PI / 2, color, 1);
      canvas.drawArc(x + size, y + size, radius, Math.PI, -Math.PI / 2, color, 1);
    },
    (x, y, color) => {
      canvas.drawArc(x, y + size, radius, -Math.PI / 2, 0, color, 1);
      canvas.drawArc(x + size, y, radius, Math.PI / 2, Math.PI, color, 1);
    },
  ];
};

