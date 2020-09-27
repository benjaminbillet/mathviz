import { createSVGWindow } from 'svgdom';
import createSvgCanvas from 'svg.js';
import Fs from 'fs';
import * as D3Color from 'd3-color';
import { makePolygon } from './polygon';
import { Color, Polygon } from './types';

export const makeSvgCanvas = () => {
  const w = createSVGWindow();
  const document = w.document;
  return createSvgCanvas(w)(document.documentElement);
};

export const saveCanvasToFile = async (svgCanvas, outputFile: string) => {
  const data = svgCanvas.svg();
  Fs.writeFileSync(outputFile, data);
};

export const drawFilledNgon = (n: number, x0: number, y0: number, radius: number, color: Color, svgCanvas) => {
  const polygon = makePolygon(n, x0, y0, radius);
  drawFilledPolygon(polygon, color, svgCanvas);
};

export const drawNgon = (n: number, x0: number, y0: number, radius: number, stroke: number, color: Color, svgCanvas) => {
  const polygon = makePolygon(n, x0, y0, radius);
  drawPolygon(polygon, color, stroke, svgCanvas);
};

export const drawPolygon = (polygon: Polygon, color: Color, stroke: number, svgCanvas) => {
  const polygonString = polygon.reduce((str, z) => `${str}${Math.trunc(z.re)},${Math.trunc(z.im)} `, '').trim();
  svgCanvas.polygon(polygonString).fill('none').stroke({
    width: stroke,
    color: D3Color.rgb(...color.map(x => x * 255)).formatHex(),
  });
};

export const drawFilledPolygon = (polygon: Polygon, color: Color, svgCanvas) => {
  const polygonString = polygon.reduce((str, z) => `${str}${Math.trunc(z.re)},${Math.trunc(z.im)} `, '').trim();
  svgCanvas.polygon(polygonString).fill(D3Color.rgb(...color.map(x => x *255)).formatHex());
};

export default {
  drawFilledNgon, drawNgon,
};

export const getScaledRaster = (scale = 1) => {
  return {
    drawFilledNgon: (n: number, x0: number, y0: number, radius: number, color: Color, svgCanvas) => drawFilledNgon(n, x0, y0, radius * scale, color, svgCanvas),
    drawNgon: (n: number, x0: number, y0: number, radius: number, stroke: number, color: Color, svgCanvas) => drawNgon(n, x0, y0, radius * scale, stroke * scale, color, svgCanvas),
  }
};