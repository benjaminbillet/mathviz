import { complex, ComplexNumber } from './complex';
import { computeVoronoi } from './voronoi';
import { computeCentroid } from './polygon';
import { integrateTriangle, STRANG9 } from './triangle-integration';
import { ComplexToRealFunction, Polygon } from './types';

const pointEquals = (p0: ComplexNumber, p1: ComplexNumber, threshold: number) => {
	return Math.abs(p0.re - p1.re) < threshold && Math.abs(p0.im - p1.im) < threshold;
}

export const applyLloydRelaxation = (points: ComplexNumber[], width: number, height: number, equalityThreshold = 0.01, maxIterations = 100) => {
  let newPoints = points;
  let voronoiResult = null;
  for (let i = 0; i < maxIterations; i++) {
    let converged = true;
    voronoiResult = computeVoronoi(newPoints, width, height);
    newPoints = voronoiResult.map(({ polygon, site }) => {
      const centroid = computeCentroid(polygon);
      if (!pointEquals(site, centroid, equalityThreshold)) {
        converged = false;
      }
      return centroid;
    });
    if (converged) {
      break;
    }
  }
  return voronoiResult;
};

export const applyWeightedLloydRelaxation = (points: ComplexNumber[], width: number, height: number, weightFunction: ComplexToRealFunction, equalityThreshold = 0.01, maxIterations = 100, integrationScheme = STRANG9) => {
  let newPoints = points;
  let voronoiResult = null;
  for (let i = 0; i < maxIterations; i++) {
    let converged = true;
    voronoiResult = computeVoronoi(newPoints, width, height);
    newPoints = voronoiResult.map(({ polygon, site }) => {
      const centroid = computeTriangulatedCentroid(site, polygon, weightFunction, integrationScheme);
      if (!pointEquals(site, centroid, equalityThreshold)) {
        converged = false;
      }
      return centroid;
    });
    if (converged) {
      break;
    }
  }
  return voronoiResult;
};

const computeTriangulatedCentroid = (site: ComplexNumber, polygon: Polygon, f: ComplexToRealFunction, integrationScheme = STRANG9): ComplexNumber => {
  // TODO check collinear case?
  const initial = site;

  let totalArea = 0;
  let centroidX = 0;
  let centroidY = 0;
  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    const triangle = [initial, p1, p2];
    const area = integrateTriangle(f, triangle, integrationScheme);

    totalArea += area;
    centroidX += integrateTriangle(z => z.re * f(z), triangle, integrationScheme);
    centroidY += integrateTriangle(z => z.im * f(z), triangle, integrationScheme);
  }

  if (isNaN(totalArea) || totalArea == 0 || !isFinite(totalArea)) {
    throw new Error('Oupsie');
  }
  
  return complex(centroidX / totalArea, centroidY / totalArea);
};