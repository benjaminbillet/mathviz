import { complex, ComplexNumber } from './complex';
import { makeBoundingBox, makePolygon, withinPolygon } from './polygon';
import { Color, PixelPlotter, Polygon } from './types';

export const drawFilledCircle = (x0: number, y0: number, radius: number, color: Color, plot: PixelPlotter) => {
  const limit = radius * radius;

  for (let x = x0 - radius; x <= x0 + radius; x++) {
    for (let y = y0 - radius; y <= y0 + radius; y++) {
      const nx = x - x0;
      const ny = y - y0;
      if (nx * nx + ny * ny < limit) {
        plot(x, y, color);
      }
    }
  }
};

export const drawFilledEllipse = (x0: number, y0: number, a: number, b: number, color: Color, plot: PixelPlotter) => {
  for (let x = x0 - a; x <= x0 + a; x++) {
    for (let y = y0 - b; y <= y0 + b; y++) {
      const nx = (x - x0) / a;
      const ny = (y - y0) / b;
      if (nx * nx + ny * ny < 1) {
        plot(x, y, color);
      }
    }
  }
};

export const drawFilledRectangle = (x0: number, y0: number, width: number, height: number, color: Color, plot: PixelPlotter) => {
  for (let x = x0; x <= x0 + width; x++) {
    for (let y = y0; y <= y0 + height; y++) {
      plot(x, y, color);
    }
  }
};

export const drawFilledSquare = (x0: number, y0: number, width: number, color: Color, plot: PixelPlotter) => {
  for (let x = x0; x <= x0 + width; x++) {
    for (let y = y0; y <= y0 + width; y++) {
      plot(x, y, color);
    }
  }
};

export const drawFilledNgon = (n: number, x0: number, y0: number, radius: number, color: Color, plot: PixelPlotter) => {
  const polygon = makePolygon(n, x0, y0, radius);
  for (let x = x0 - radius; x <= x0 + radius; x++) {
    for (let y = y0 - radius; y <= y0 + radius; y++) {
      if (withinPolygon(complex(x, y), polygon)) {
        plot(x, y, color);
      }
    }
  }
};

export const drawNgon = (n: number, x0: number, y0: number, radius: number, color: Color, plot: PixelPlotter) => {
  const polygon = makePolygon(n, x0, y0, radius);
  drawPolygon(polygon, color, plot);
};

export const drawFilledPolygon = (polygon: Polygon, color: Color, plot: PixelPlotter) => {
  const boundingBox = makeBoundingBox(polygon);
  for (let x = boundingBox.xmin; x <= boundingBox.xmax; x++) {
    for (let y = boundingBox.ymin; y <= boundingBox.ymax; y++) {
      if (withinPolygon(complex(x, y), polygon)) {
        plot(x, y, color);
      }
    }
  }
};

// http://www.javascriptteacher.com/bresenham-line-drawing-algorithm.html
export const drawBresenhamLine = (x1: number, y1: number, x2: number, y2: number, color: Color, plot: PixelPlotter) => {
  // line deltas
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dx1 = Math.abs(dx);
  const dy1 = Math.abs(dy);

  // error intervals for both axis
  let px = 2 * dy1 - dx1;
  let py = 2 * dx1 - dy1;

  let xe;
  let ye;

  // pixels to draw
  let x;
  let y;

  // the line is X-axis dominant
  if (dy1 <= dx1) {
    if (dx >= 0) { // line is drawn left to right
      x = x1;
      y = y1;
      xe = x2;
    } else { // line is drawn right to left (swap ends)
      x = x2;
      y = y2;
      xe = x1;
    }

    plot(x, y, color); // first pixel

    // rasterize the line
    for (let i = 0; x < xe; i++) {
      x = x + 1;

      // deal with octants
      if (px < 0) {
        px = px + 2 * dy1;
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          y = y + 1;
        } else {
          y = y - 1;
        }
        px = px + 2 * (dy1 - dx1);
      }

      // draw pixel from line span at currently rasterized position
      plot(x, y, color);
    }
  } else { // the line is Y-axis dominant
    if (dy >= 0) { // line is drawn bottom to top
      x = x1;
      y = y1;
      ye = y2;
    } else { // line is drawn top to bottom
      x = x2;
      y = y2;
      ye = y1;
    }

    plot(x, y, color); // first pixel

    // rasterize the line
    for (let i = 0; y < ye; i++) {
      y = y + 1;

      // deal with octants
      if (py <= 0) {
        py = py + 2 * dx1;
      } else {
        if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
          x = x + 1;
        } else {
          x = x - 1;
        }
        py = py + 2 * (dx1 - dy1);
      }

      // draw pixel from line span at currently rasterized position
      plot(x, y, color);
    }
  }
};

export const drawBresenhamCircle = (x0: number, y0: number, radius: number, color: Color, plot: PixelPlotter) => {
  let x = radius;
  let y = 0;
  let radiusError = 1 - x;

  while (x >= y) {
    plot(x + x0, y + y0, color);
    plot(y + x0, x + y0, color);
    plot(-x + x0, y + y0, color);
    plot(-y + x0, x + y0, color);
    plot(-x + x0, -y + y0, color);
    plot(-y + x0, -x + y0, color);
    plot(x + x0, -y + y0, color);
    plot(y + x0, -x + y0, color);
    y++;

    if (radiusError < 0) {
      radiusError += 2 * y + 1;
    } else {
      x--;
      radiusError += 2 * (y - x + 1);
    }
  }
};

export const drawPolygon = (polygon: Polygon, color: Color, plot: PixelPlotter, drawLineFunc = drawBresenhamLine) => {
  for (let i = 1; i < polygon.length; i++) {
    const z1 = polygon[i - 1];
    const z2 = polygon[i];
    drawLineFunc(Math.trunc(z1.re), Math.trunc(z1.im), Math.trunc(z2.re), Math.trunc(z2.im), color, plot);
  }

  const z1 = polygon[polygon.length - 1];
  const z2 = polygon[0];
  drawLineFunc(Math.trunc(z1.re), Math.trunc(z1.im), Math.trunc(z2.re), Math.trunc(z2.im), color, plot);
};

export const drawWuLine = (x0: number, y0: number, x1: number, y1: number, color: Color, plot: PixelPlotter) => {
  const steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
  if (steep) {
    // swap x and y axis
    drawWuLine(y0, x0, y1, x1, color, plot);
  } else if (x0 > x1) {
    // swap points
    drawWuLine(x1, y1, x0, y0, color, plot);
  }

  const dx = x1 - x0;
  const dy = y1 - y0;
  const gradient = dy / dx;

  // handle first endpoint
  let xend = Math.round(x0);
  let yend = y0 + gradient * (xend - x0);
  let xgap = 1 - ((x0 + 0.5) - Math.floor(x0 + 0.5));
  const xpxl1 = xend; // this will be used in the main loop
  const ypxl1 = Math.floor(yend);

  if (steep) {
    plot(ypxl1, xpxl1, color, (1 - (yend - Math.floor(yend))) * xgap);
    plot(ypxl1 + 1, xpxl1, color, (yend - Math.floor(yend)) * xgap);
  } else {
    plot(xpxl1, ypxl1, color, (1 - (yend - Math.floor(yend))) * xgap);
    plot(xpxl1, ypxl1 + 1, color, (yend - Math.floor(yend)) * xgap);
  }

  let intery = yend + gradient;

  xend = Math.round(x1);
  yend = y1 + gradient * (xend - x1);
  xgap = ((x0 + 0.5) - Math.floor(x0 + 0.5));
  const xpxl2 = xend; // this will be used in the main loop
  const ypxl2 = Math.floor(yend);

  if (steep) {
    plot(ypxl2, xpxl2, color, (1 - (yend - Math.floor(yend))) * xgap);
    plot(ypxl2 + 1, xpxl2, color, (yend - Math.floor(yend)) * xgap);
  } else {
    plot(xpxl2, ypxl2, color, (1 - (yend - Math.floor(yend))) * xgap);
    plot(xpxl2, ypxl2 + 1, color, (yend - Math.floor(yend)) * xgap);
  }

  for (let x = xpxl1 + 1; x <= xpxl2 - 1; x++) {
    if (steep) {
      plot(Math.floor(intery), x, color, (1 - (intery - Math.floor(intery))));
      plot(Math.floor(intery) + 1, x, color, (intery - Math.floor(intery)));
    } else {
      plot(x, Math.floor(intery), color, (1 - (intery - Math.floor(intery))));
      plot(x, Math.floor(intery) + 1, color, (intery - Math.floor(intery)));
    }
    intery = intery + gradient;
  }
};

export const drawWuEllipse = (x0: number, y0: number, radiusX: number, radiusY: number, color: Color, plot: PixelPlotter) => {
  const radiusX2 = radiusX * radiusX;
  const radiusY2 = radiusY * radiusY;

  // upper and lower halves
  let quarter = Math.round(radiusX2 / Math.sqrt(radiusX2 + radiusY2));
  for (let x = 0; x <= quarter; x++) {
    const y = radiusY * Math.sqrt(1 - x * x / radiusX2);
    const yTrunc = Math.floor(y);
    const delta = y - yTrunc;
    plot4Pixels(plot, x0, y0, x, yTrunc, color, 1 - delta);
    plot4Pixels(plot, x0, y0, x, yTrunc + 1, color, delta);
  }
  // right and left halves
  quarter = Math.round(radiusY2 / Math.sqrt(radiusX2 + radiusY2));
  for (let y = 0; y <= quarter; y++) {
    const x = radiusX * Math.sqrt(1 - y * y / radiusY2);
    const xTrunc = Math.floor(x);
    const delta = x - xTrunc;
    plot4Pixels(plot, x0, y0, xTrunc, y, color, 1 - delta);
    plot4Pixels(plot, x0, y0, xTrunc + 1, y, color, delta);
  }
};

export const drawWuCircle = (x0: number, y0: number, radius: number, color: Color, plot: PixelPlotter) => {
  const radius2 = radius * radius;

  // upper and lower halves
  const quarter = Math.round(radius / Math.SQRT2);
  for (let x = 0; x <= quarter; x++) {
    const y = Math.sqrt(radius2 - x * x);
    const yTrunc = Math.floor(y);
    const delta = y - yTrunc;
    plot4Pixels(plot, x0, y0, x, yTrunc, color, 1 - delta);
    plot4Pixels(plot, x0, y0, x, yTrunc + 1, color, delta);
  }
  // right and left halves
  for (let y = 0; y <= quarter; y++) {
    const x = Math.sqrt(radius2 - y * y);
    const xTrunc = Math.floor(x);
    const delta = x - xTrunc;
    plot4Pixels(plot, x0, y0, xTrunc, y, color, 1 - delta);
    plot4Pixels(plot, x0, y0, xTrunc + 1, y, color, delta);
  }
};

export const fillShape = (buffer: Float32Array, width: number, height: number, color: Color, x: number, y: number) => {
  if (x < 0 || x >= width || y < 0 || y >= height) {
    return;
  }

  const pixelsToTest: ComplexNumber[] = [];
  pixelsToTest.push(complex(Math.trunc(x), Math.trunc(y)));

  const startPixelIdx = (pixelsToTest[0].re + pixelsToTest[0].im * width) * 4;
  const startPixelColor = [ buffer[startPixelIdx + 0], buffer[startPixelIdx + 1], buffer[startPixelIdx + 2] ];

  while (pixelsToTest.length > 0) {
    const length = pixelsToTest.length;
    for (let i = 0; i < length; i++) {
      const z = pixelsToTest.pop();
      const idx = (z.re + z.im * width) * 4;
      if (z.re >= 0 && z.re < width && z.im >= 0 && z.im < height
          && buffer[idx] === startPixelColor[0] && buffer[idx + 1] === startPixelColor[1] && buffer[idx + 2] === startPixelColor[2]) {
        buffer[idx + 0] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
        pixelsToTest.push(complex(z.re, z.im - 1));
        pixelsToTest.push(complex(z.re, z.im + 1));
        pixelsToTest.push(complex(z.re - 1, z.im));
        pixelsToTest.push(complex(z.re + 1, z.im));
      }
    }
  }
};

const plot4Pixels = (plot: PixelPlotter, x0: number, y0: number, x: number, y: number, color: Color = [ 1, 1, 1 ], alpha = 1) => {
  if (color.length === 4) {
    alpha *= color[3];
  }
  plot(x0 + x, y0 + y, color, alpha);
  plot(x0 - x, y0 + y, color, alpha);
  plot(x0 + x, y0 - y, color, alpha);
  plot(x0 - x, y0 - y, color, alpha);
};

