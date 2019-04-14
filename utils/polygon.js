import { complex } from '../utils/complex';
import { randomComplex } from './random';

/*
 * Returns a triangle composed of three points in a [0, 1]² complex space
 *       tX, tY
 *     .        .
 *   .            .
 * 0,0 .  .  .  . 1,0
 */
export const makeTriangle = (topX = 0.5, topY = 1) => {
  return [
    complex(0, 0),
    complex(topX, topY),
    complex(1, 0),
  ];
};

/*
 * Returns a square in a [0, 1]² complex space
 */
export const makeSquare = () => {
  return [
    complex(0, 0),
    complex(1, 0),
    complex(1, 1),
    complex(0, 1),
  ];
};

/*
 * Returns a pentagon in a [0, 1]² complex space
 */
export const makePentagon = () => {
  return [
    complex(0.5, 0),
    complex(1, 0.33),
    complex(0.83, 1),
    complex(0.16, 1),
    complex(0, 0.33),
  ];
};

/*
 * Returns a hexagon in a [0, 1]² complex space
 */
export const makeHexagon = () => {
  return [
    complex(0.5, 0),
    complex(0, 0.25),
    complex(0, 0.75),
    complex(0.5, 1),
    complex(1, 0.25),
    complex(1, 0.75),
  ];
};

/*
 * Generates a regular n-gon based on the resolution of the equation zⁿ = 1:
 * -> zⁿ = reⁱⁿᶿ (exponential form, with r = 1) = 1
 * -> eⁱⁿᶿ = e⁰ = 1 => nθ = 0 + 2kπ (k ∈ ℤ) => θ = 2kπ / n
 * => The solution of zⁿ = 1 are: cos(2kπ / n) + i sin(2kπ / n), for k = [0, ..., n-1]
 * @param {*} n
 * @param {*} centerX
 * @param {*} centerY
 * @param {*} radius
 * @param {*} rotation
 */
export const makePolygon = (n, centerX = 0, centerY = 0, radius = 1, rotationRadians = 0) => {
  const angle = (2 * Math.PI) / n;

  /* if (rotationRadians = null) {
    if (n === 4) {
      rotationRadians = Math.PI / 4;
    } else {
      rotationRadians = Math.PI;
    }
  }*/

  const vertices = [];
  for (let i = 0; i < n; i++) {
    const verticeX = centerX + radius * Math.sin((i * angle) + rotationRadians);
    const verticeY = centerY + radius * Math.cos((i * angle) + rotationRadians);
    vertices.push(complex(verticeX, verticeY));
  }
  return vertices;
};

/*
 * Build a bounding box around a convex polygon.
 * @param {Complex[]} polygon
 */
export const makeBoundingBox = (polygon) => {
  let i = polygon.length - 1;
  let xmin = polygon[i].re;
  let xmax = xmin;
  let ymin = polygon[i].im;
  let ymax = ymin;
  while (--i >= 0) {
    const z = polygon[i];
    if (z.re < xmin) {
      xmin = z.re;
    } else if (z.re > xmax) {
      xmax = z.re;
    }
    if (z.im < ymin) {
      ymin = z.im;
    } else if (z.im > ymax) {
      ymax = z.im;
    }
  }
  return { xmin, xmax, ymin, ymax };
};

/*
 * Checks whether a point is inside or outside a polygon, using a ray-casting algorithm
 * (based on http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html):
 * A vertical line L is drawn through the tested point and we count the number of time L crosses a polygon segment.
 * If the number of crosses is odd, then the point is inside the polygon.
 * @param {Complex} point
 * @param {Complex[]} polygon
 */
export const withinPolygon = (point, polygon) => {
  let inside = false;

  const xp = point.re;
  const yp = point.im;

  let j = polygon.length - 1;
  for (let i = 0; i < polygon.length; i++) {
    const xi = polygon[i].re;
    const yi = polygon[i].im;
    const xj = polygon[j].re;
    const yj = polygon[j].im;

    if (((yi > yp) != (yj > yp))
        && (xp < (xj - xi) * (yp - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
    j = i;
  }

  return inside;
};

/*
 * @param {Complex[]} polygon
 * @param {{ xmin, xmax, ymin, ymax }} box An optional bounding box
 */
export const getRandomPointInPolygon = (polygon, box = null) => {
  if (box == null) {
    box = makeBoundingBox(polygon);
  }
  while (true) {
    const c = randomComplex(box.xmin, box.xmax, box.ymin, box.ymax);
    if (withinPolygon(c, polygon)) {
      return c;
    }
  }
};
