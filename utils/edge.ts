import { ComplexNumber } from './complex';

// finds if an edge p0-p1 is below a point p
export const isEdgeBelowPoint = (p0: ComplexNumber, p1: ComplexNumber, isP0Left: boolean, p: ComplexNumber) => {
  if (isP0Left) {
    return (p0.re - p.re) * (p1.im - p.im) - (p1.re - p.re) * (p0.im - p.im) > 0;
  }
  return (p1.re - p.re) * (p0.im - p.im) - (p0.re - p.re) * (p1.im - p.im) > 0;
}

export const isEdgeAbovePoint = (p0: ComplexNumber, p1: ComplexNumber, isP0Left: boolean, p: ComplexNumber) => {
  return !isEdgeBelowPoint(p0, p1, isP0Left, p);
}

export const isVertical = (p0: ComplexNumber, p1: ComplexNumber) => {
  return p0.re === p1.re;
}
