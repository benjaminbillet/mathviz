import { complex, ComplexNumber } from './complex';
import { ComplexParametricFunction } from './types';

export const makeQuadraticBezier = (p0: ComplexNumber, p1: ComplexNumber, p2: ComplexNumber): ComplexParametricFunction => {
  return (t) => {
    const oneMinusT = 1 - t;
    const oneMinusTSquared = oneMinusT * oneMinusT;
    const tSquared = t * t;
    const x = oneMinusTSquared * p0.re + 2 * oneMinusT * t * p1.re + tSquared * p2.re;
    const y = oneMinusTSquared * p0.im + 2 * oneMinusT * t * p1.im + tSquared * p2.im;
    return complex(x, y);
  };
};

export const makeCubicBezier = (p0: ComplexNumber, p1: ComplexNumber, p2: ComplexNumber, p3: ComplexNumber): ComplexParametricFunction => {
  return (t) => {
    const cX = 3 * (p1.re - p0.re);
    const bX = 3 * (p2.re - p1.re) - cX;
    const aX = p3.re - p0.re - cX - bX;

    const cY = 3 * (p1.im - p0.im);
    const bY = 3 * (p2.im - p1.im) - cY;
    const aY = p3.im - p0.im - cY - bY;

    const tSquared = t * t;
    const x = (aX * t * tSquared) + (bX * tSquared) + (cX * t) + p0.re;
    const y = (aY * t * tSquared) + (bY * tSquared) + (cY * t) + p0.im;

    return complex(x, y);
  };
};

export const makeArc = (p0: ComplexNumber, p1: ComplexNumber, startAngle: number, endAngle: number): ComplexParametricFunction => {
  return (t) => {
    const angle = startAngle + (endAngle - startAngle) * t;
    const x = p0.re + p1.re * Math.cos(angle);
    const y = p0.im + p1.im * Math.sin(angle);
    return complex(x, y);
  };
};
