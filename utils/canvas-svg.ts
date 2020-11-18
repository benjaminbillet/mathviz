import { createSVGWindow } from 'svgdom';
import createSvgCanvas from 'svg.js';
import Fs from 'fs';
import * as D3Color from 'd3-color';
import { makePolygon } from './polygon';
import { Color, Polygon } from './types';
import { eulerComplex } from './complex';
import { TWO_PI } from './math';

export type SvgDocument = any; // bogus typing

export const makeSvgDocument = (): SvgDocument => {
  const w = createSVGWindow();
  const document = w.document;
  return createSvgCanvas(w)(document.documentElement);
};

export const saveSvgToFile = (document: SvgDocument, outputFile: string) => {
  const data = document.svg();
  Fs.writeFileSync(outputFile, data);
};

const drawFilledNgon = (n: number, x0: number, y0: number, radius: number, color: Color, document: SvgDocument) => {
  const polygon = makePolygon(n, x0, y0, radius);
  drawFilledPolygon(polygon, color, document);
};

const drawNgon = (n: number, x0: number, y0: number, radius: number, stroke: number, color: Color, document: SvgDocument) => {
  const polygon = makePolygon(n, x0, y0, radius);
  drawPolygon(polygon, color, stroke, document);
};

const drawPolygon = (polygon: Polygon, color: Color, stroke: number, document: SvgDocument) => {
  const polygonString = polygon.reduce((str, z) => `${str}${Math.round(z.re)},${Math.round(z.im)} `, '').trim();
  document.polygon(polygonString).fill('none').stroke({
    width: stroke,
    color: D3Color.rgb(...color.map(x => x * 255)).formatHex(),
  });
};

const drawFilledPolygon = (polygon: Polygon, color: Color, document: SvgDocument) => {
  const polygonString = polygon.reduce((str, z) => `${str}${z.re},${z.im} `, '').trim();
  document.polygon(polygonString).fill(D3Color.rgb(...color.map(x => x *255)).formatHex());
};

const drawArc = (x0: number, y0: number, radius: number, startAngle: number, endAngle: number, color: Color, stroke: number, document: SvgDocument) => {
  // compute the begin and end of the arc
  const start = eulerComplex(endAngle).mul(radius);
  const end = eulerComplex(startAngle).mul(radius);

  var largeArcFlag = ((endAngle - startAngle) % TWO_PI) <= Math.PI ? 0 : 1;
  const arcString = [
    'M', x0 + start.re, y0 + start.im, 
    'A', radius, radius, 0, largeArcFlag, 0, x0 + end.re, y0 + end.im
  ].join(' ');

  document.path(arcString).fill('none').stroke({
    width: stroke,
    color: D3Color.rgb(...color.map(x => x * 255)).formatHex(),
  });
};

const drawLine = (x0: number, y0: number, x1: number, y1: number, color: Color, stroke: number, document: SvgDocument) => {
  document.line(x0, y0, x1, y1).fill('none').stroke({
    width: stroke,
    color: D3Color.rgb(...color.map(x => x * 255)).formatHex(),
  });
};

const drawFilledCircle = (x0: number, y0: number, radius: number, color: Color, document: SvgDocument) => {
  document.circle(radius * 2).attr({ cx: x0, cy: y0 }).fill(D3Color.rgb(...color.map(x => x * 255)).formatHex());
};

const drawFilledRectangle = (x0: number, y0: number, width: number, height: number, color: Color, document: SvgDocument) => {
  document.rect(width, height).attr({ x: x0, y: y0 }).fill(D3Color.rgb(...color.map(x => x * 255)).formatHex());
};


export interface SvgCanvas {
  drawFilledNgon: (n: number, x0: number, y0: number, radius: number, color: Color) => void,
  drawNgon: (n: number, x0: number, y0: number, radius: number, stroke: number, color: Color) => void,
  drawFilledPolygon: (polygon: Polygon, color: Color) => void,
  drawPolygon: (polygon: Polygon, color: Color, stroke: number) => void,
  drawLine: (x0: number, y0: number, x1: number, y1: number, color: Color, stroke: number) => void,
  drawArc: (x0: number, y0: number, radius: number, angle1: number, angle2: number, color: Color, stroke: number) => void,
  drawFilledCircle: (x0: number, y0: number, radius: number, color: Color) => void,
  drawFilledRectangle: (x0: number, y0: number, width: number, height: number, color: Color) => void,
};
export const makeSvgCanvas = (document: SvgDocument, scale = 1): SvgCanvas => {
  return {
    drawFilledNgon: (n, x0, y0, radius, color) => drawFilledNgon(n, x0, y0, radius * scale, color, document),
    drawNgon: (n, x0, y0, radius, stroke, color) => drawNgon(n, x0, y0, radius * scale, stroke * scale, color, document),
    drawFilledPolygon: (polygon, color) => drawFilledPolygon(polygon.map(z => z.mul(scale)), color, document),
    drawPolygon: (polygon, color, stroke) => drawPolygon(polygon.map(z => z.mul(scale)), color, stroke * scale, document),
    drawLine: (x0, y0, x1, y1, color, stroke) => drawLine(x0, y0, x1, y1, color, stroke * scale, document),
    drawArc: (x0, y0, radius, angle1, angle2, color, stroke) => drawArc(x0, y0, radius * scale, angle1, angle2, color, stroke * scale, document),
    drawFilledCircle: (x0, y0, radius, color) => drawFilledCircle(x0, y0, radius * scale, color, document),
    drawFilledRectangle: (x0, y0, width, height, color) => drawFilledRectangle(x0, y0, width, height, color, document),
  }
};
