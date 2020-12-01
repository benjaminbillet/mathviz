import { complex, ComplexNumber } from '../utils/complex';
import { randomComplex, randomInteger } from './random';
import { euclidean2d, euclideanSquared2d } from './distance';
import { Box, Circle, ComplexToRealFunction, Optional, Polygon } from './types';
import { det2 } from './vector';
import { CENTROID, integrateTriangle, STRANG9 } from './triangle-integration';


/*
 * Returns a triangle composed of three points in a [0, 1]² complex space
 *       tX, tY
 *     .        .
 *   .            .
 * 0,0 .  .  .  . 1,0
 */
export const makeTriangle = (topX = 0.5, topY = 1): Polygon => {
  return [
    complex(0, 0),
    complex(topX, topY),
    complex(1, 0),
  ];
};

/*
 * Returns a square in a [0, 1]² complex space
 */
export const makeSquare = (): Polygon => {
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
export const makePentagon = (): Polygon => {
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
export const makeHexagon = (): Polygon => {
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
export const makePolygon = (n: number, centerX = 0, centerY = 0, radius = 1, rotationRadians = 0): Polygon => {
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
export const makeBoundingBox = (polygon: Polygon): Box => {
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
export const withinPolygon = (point: ComplexNumber, polygon: Polygon) => {
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

export const withinCircle = (point: ComplexNumber, c: ComplexNumber, r: number) => {
  const x = point.re - c.re;
  const y = point.im - c.im;
  return euclideanSquared2d(x, y, c.re, c.im) <= r;
};

// iterative version of https://en.wikipedia.org/wiki/Smallest-circle_problem#Welzl's_algorithm
export const makeBoundingCircle = (polygon: Polygon, rSet: ComplexNumber[] = []): Circle => {
  if (polygon.length === 1) {
    return { center: polygon[0], radius: 0 };
  } else if (polygon.length === 2) {
    const centerX = (polygon[0].re + polygon[1].re) / 2;
    const centerY = (polygon[0].im + polygon[1].im) / 2;
    const radius = euclidean2d(polygon[0].re, polygon[0].im, polygon[1].re, polygon[1].im);
    return { center: complex(centerX, centerY), radius };
  } else if (polygon.length === 3) {
    return triangleCircumcircle(polygon);
  }

  const idx = randomInteger(0, polygon.length);
  const p = polygon[idx];
  const newPolygon = polygon.splice(idx, 1);

  const boundingCircle = makeBoundingCircle(newPolygon);
  if (withinCircle(p, boundingCircle.center, boundingCircle.radius)) {
    return boundingCircle;
  }

  rSet.push(p);
  return makeBoundingCircle(newPolygon, rSet);
};

// https://en.wikipedia.org/wiki/Circumscribed_circle#Cartesian_coordinates_from_cross-_and_dot-products
export const triangleCircumcircle = (triangle: Polygon): Circle => {
  const [ a, b, c ] = triangle;
  let cx = 0;
  let cy = 0;
  let radius = 0;

  const A = b.re - a.re;
  const B = b.im - a.im;
  const C = c.re - a.re;
  const D = c.im - a.im;
  const E = A * (a.re + b.re) + B * (a.im + b.im);
  const F = C * (a.re + c.re) + D * (a.im + c.im);
  const G = 2 * (A * (c.im - b.im) - B * (c.re - b.re));

  let minx = 0;
  let miny = 0;
  let dx = 0;
  let dy = 0;

  // if the points of the triangle are collinear, then just find the extremes and use the midpoint as the center of the circumcircle.
  if (Math.abs(G) < 0.000001) {
    minx = Math.min(a.re, b.re, c.re);
    miny = Math.min(a.im, b.im, c.im);
    dx   = (Math.max(a.re, b.re, c.re) - minx) * 0.5;
    dy   = (Math.max(a.im, b.im, c.im) - miny) * 0.5;

    cx = minx + dx;
    cy = miny + dy;
    radius = Math.sqrt(dx * dx + dy * dy);
  } else {
    cx = (D*E - B*F) / G;
    cy = (A*F - C*E) / G;
    dx = cx - a.re;
    dy = cy - a.im;
    radius = Math.sqrt(dx * dx + dy * dy);
  }

  return { center: complex(cx, cy), radius };
};

/*
 * @param {Complex[]} polygon
 * @param {{ xmin, xmax, ymin, ymax }} box An optional bounding box
 */
export const getRandomPointInPolygon = (polygon: Polygon, box?: Box) => {
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

/*
  Returns a positive value if the points a, b, and c occur in counterclockwise order (c lies to the left of the directed line defined by points a and b).
  Returns a negative value if they occur in clockwise order (c lies to the right of the directed line ab).
  Returns zero if they are collinear.
*/
export const orient2d = (p1: ComplexNumber, p2: ComplexNumber, p3: ComplexNumber) => {
  return (p1.im - p3.im) * (p2.re - p3.re) - (p1.re - p3.re) * (p2.im - p3.im);
};

export const computeCentroid = (polygon: Polygon): ComplexNumber => {
  // TODO check collinear case?
  let centroidX = 0;
  let centroidY = 0;
  let detSum = 0;
  for (let i = 0; i < polygon.length; i++) {
    const p0 = polygon[i];
    const p1 = polygon[(i + 1) % polygon.length];
    const det = p0.re * p1.im - p1.re * p0.im;
    centroidX += (p0.re + p1.re) * det;
    centroidY += (p0.im + p1.im) * det;
    detSum += det;
  }
  
  return complex(centroidX / (3 * detSum), centroidY / (3 * detSum));
};

// https://en.wikipedia.org/wiki/Graham_scan would be better instead of just sorting
export const makeConvexBoundingPolygon = (points: ComplexNumber[]) => {
  const polygon = [ ...points ];

  // find a start point
  let first = polygon[0];
  for (let i = 1; i < polygon.length; i++) {
    if (polygon[i].im < first.im) {
      first = polygon[i];
    } else if (polygon[i].im === first.im && polygon[i].re > first.re) {
      first = polygon[i];
    }
  }

  polygon.sort((a, b) => {
    const isLeft = (a.re - first.re) * (b.im - first.im) - (b.re - first.re) * (a.im - first.im);
    if (isLeft === 0) {
      return euclideanSquared2d(first.re, first.im, a.re, a.im) - euclideanSquared2d(first.re, first.im, b.re, b.im);
    }
    return isLeft;
  });

  return polygon;
};
