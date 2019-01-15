import { complex } from './complex';

export const makeCubicBezier = (p0, p1, p2, p3) => {
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
