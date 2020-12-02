import { PixelPlotter } from '../../utils/types';
import affine from '../../utils/affine';
import { complex } from '../../utils/complex';
import { SvgDocument, makeSvgCanvas } from '../../utils/canvas-svg';

export const TRUCHET_TILE_SIZE = 12;

export const makeTruchetTiles = (scale: number, doc: SvgDocument): PixelPlotter[] => {
  const canvas = makeSvgCanvas(doc, scale);
  const unitTriangleCentered = [
    complex(0, 0),
    complex(1, 0),
    complex(0, 1),
  ].map(z => affine.applyAffine2dFromMatrix(affine.combine(affine.translate(-0.5, -0.5)), z));

  const mat = affine.combine(affine.scale(TRUCHET_TILE_SIZE * scale, TRUCHET_TILE_SIZE * scale), affine.translate(0.5, 0.5));

  const triangle1 = unitTriangleCentered.map(z => affine.applyAffine2dFromMatrix(mat, z));
  const triangle2 = unitTriangleCentered.map(z => affine.applyAffine2dFromMatrix(affine.combine(mat, affine.rotate(Math.PI / 2)), z));
  const triangle3 = unitTriangleCentered.map(z => affine.applyAffine2dFromMatrix(affine.combine(mat, affine.rotate(Math.PI)), z));
  const triangle4 = unitTriangleCentered.map(z => affine.applyAffine2dFromMatrix(affine.combine(mat, affine.rotate(3 * Math.PI / 2)), z));

  return [
    (x, y, color) => canvas.drawFilledPolygon(triangle1.map(z => z.add(complex(x, y))), color),
    (x, y, color) => canvas.drawFilledPolygon(triangle2.map(z => z.add(complex(x, y))), color),
    (x, y, color) => canvas.drawFilledPolygon(triangle3.map(z => z.add(complex(x, y))), color),
    (x, y, color) => canvas.drawFilledPolygon(triangle4.map(z => z.add(complex(x, y))), color),
  ];
};

