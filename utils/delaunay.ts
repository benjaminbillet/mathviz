import { complex, ComplexNumber } from './complex';
import { euclidean2d } from './distance';
import { triangleCircumcircle } from './polygon';
import { Circle, Edge, Polygon } from './types';

export type DelaunayTriangle = {
  circumcircle: Circle,
  points: Polygon,
};

// Bowyer-Watson algorithm http://paulbourke.net/papers/triangulate

const makeTriangle = (p0: ComplexNumber, p1: ComplexNumber, p2: ComplexNumber) => {
  const points = [ p0, p1, p2 ];
  const circumcircle = triangleCircumcircle(points);
  return { circumcircle, points };
}

const pointEquals = (p0: ComplexNumber, p1: ComplexNumber) => {
	return Math.abs(p0.re - p1.re) < 0.0001 && Math.abs(p0.im - p1.im) < 0.0001;
}

const edgeEquals = (e0: Edge, e1: Edge) => {
  return (pointEquals(e0.p0, e1.p0) && pointEquals(e0.p1, e1.p1)) || (pointEquals(e0.p0, e1.p1) && pointEquals(e0.p1, e1.p0));
}

export const computeDelaunayTriangulation = (width: number, height: number, points: ComplexNumber[]) => {
  const p0 = complex(0, 0)
  const p1 = complex(width, 0)
  const p2 = complex(width, height)
  const p3 = complex(0, height)
  
  let triangles = [ makeTriangle(p0,p1,p2), makeTriangle(p0,p2,p3) ]; // initial supertriangles
  for (let i = 0; i < points.length; i++) {
    triangles = addToTriangulation(triangles, points[i]);
  }
  return triangles;
};

const addToTriangulation = (triangles: DelaunayTriangle[], point: ComplexNumber) => {
  const edges: Edge[] = [];
  const result: DelaunayTriangle[] = [];

  triangles.forEach((triangle) => {
    const distance = euclidean2d(point.re, point.im, triangle.circumcircle.center.re, triangle.circumcircle.center.im);
    if (distance < triangle.circumcircle.radius) {
      edges.push({ p0: triangle.points[0], p1: triangle.points[1] });
      edges.push({ p0: triangle.points[1], p1: triangle.points[2] });
      edges.push({ p0: triangle.points[2], p1: triangle.points[0] });
    } else {
      result.push(triangle);
    }
  });

  // remove identical edges from the edge buffer to build the enclosing polygon
  const enclosingPolygonEdges: Edge[] = [];
  edges.forEach((edge) => {
    let duplicate = false;
    for (let i = 0; i < enclosingPolygonEdges.length; i++) {
      if (edgeEquals(edge, enclosingPolygonEdges[i])) {
        // duplicate edges must be entirely removed
        enclosingPolygonEdges.splice(i, 1);
        duplicate = true;
        break;
      }
    }
    // insert new edge in the enclosing polygon if and only if no duplicate exists
    if (duplicate === false) {
      enclosingPolygonEdges.push(edge);
    }
  })
  
  enclosingPolygonEdges.forEach(edge => result.push(makeTriangle(edge.p0, edge.p1, point)))
  return result;
};
