import { Color, PixelPlotter, Polygon } from './types';
import { drawBresenhamLine, drawFilledCircle, drawFilledNgon, drawFilledPolygon, drawFilledRectangle, drawNgon, drawPolygon } from './raster';


export interface RasterCanvas {
  drawPoint: (x: number, y: number, color: Color) => void,
  drawFilledNgon: (n: number, x0: number, y0: number, radius: number, color: Color) => void,
  drawNgon: (n: number, x0: number, y0: number, radius: number, color: Color) => void,
  drawFilledPolygon: (polygon: Polygon, color: Color) => void,
  drawPolygon: (polygon: Polygon, color: Color) => void,
  drawLine: (x0: number, y0: number, x1: number, y1: number, color: Color) => void,
  drawFilledCircle: (x0: number, y0: number, radius: number, color: Color) => void,
  drawFilledRectangle: (x0: number, y0: number, width: number, height: number, color: Color) => void,
};
export const makeSvgCanvas = (plotter: PixelPlotter, scale = 1): RasterCanvas => {
  return {
    drawPoint: (x, y, color, ...others) => plotter(x, y, color, ...others),
    drawFilledNgon: (n, x0, y0, radius, color) => drawFilledNgon(n, x0, y0, radius * scale, color, plotter),
    drawNgon: (n, x0, y0, radius, color) => drawNgon(n, x0, y0, radius * scale, color, plotter),
    drawFilledPolygon: (polygon, color) => drawFilledPolygon(polygon.map(z => z.mul(scale)), color, plotter),
    drawPolygon: (polygon, color) => drawPolygon(polygon.map(z => z.mul(scale)), color, plotter),
    drawLine: (x0, y0, x1, y1, color) => drawBresenhamLine(x0, y0, x1, y1, color, plotter),
    drawFilledCircle: (x0, y0, radius, color) => drawFilledCircle(x0, y0, radius * scale, color, plotter),
    drawFilledRectangle: (x0, y0, width, height, color) => drawFilledRectangle(x0, y0, width, height, color, plotter),
  }
};
