// http://www.javascriptteacher.com/bresenham-line-drawing-algorithm.html
export const drawBresenhamLine = (x1, y1, x2, y2, plot) => {
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

    plot(x, y); // first pixel

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
      plot(x, y);
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

    plot(x, y); // first pixel

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
      plot(x, y);
    }
  }
};


export const drawBresenhamCircle = (x0, y0, radius, plot) => {
  let x = radius;
  let y = 0;
  let radiusError = 1 - x;

  while (x >= y) {
    plot(x + x0, y + y0);
    plot(y + x0, x + y0);
    plot(-x + x0, y + y0);
    plot(-y + x0, x + y0);
    plot(-x + x0, -y + y0);
    plot(-y + x0, -x + y0);
    plot(x + x0, -y + y0);
    plot(y + x0, -x + y0);
    y++;

    if (radiusError < 0) {
      radiusError += 2 * y + 1;
    } else {
      x--;
      radiusError += 2 * (y - x + 1);
    }
  }
};
