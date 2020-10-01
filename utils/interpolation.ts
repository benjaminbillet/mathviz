import { RealToRealFunction } from './types';

export const makeLanczos = (a: number): RealToRealFunction => {
  return (x) => {
    const absX = Math.abs(x);
    if (absX < 0.001) {
      return 1;
    } else if (absX >= a) {
      return 0;
    }
    const xPi = Math.PI * absX;
    return a * Math.sin(xPi / a) * Math.sin(xPi) / (xPi * xPi);
  };
};

export const makeSpline = (a: number, b: number): RealToRealFunction => {
  return (x) => {
    const absX = Math.abs(x);
    let result = 0;
    if (absX < 1) {
      const c3 = (-6 * a) - (9 * b) + 12;
      const c2 = (6 * a) + (12 * b) - 18;
      const c0 = -(2 * b) + 6;
      result = c3 * absX * absX * absX + c2 * absX * absX + c0;
    } else if (absX < 2) {
      const c3 = (-6 * a) - b;
      const c2 = (30 * a) + (6 * b);
      const c1 = (-48 * a) - (12 * b);
      const c0 = (24 * a) + (8 * b);
      result = c3 * absX * absX * absX + c2 * absX * absX + c1 * absX + c0;
    }
    return result / 6;
  };
};

export const makeCatmullRom = () => makeSpline(0.5, 0);
export const makeCubicBSpline = () => makeSpline(0, 1);
export const makeMitchellNetravali = () => makeSpline(1/3, 1/3);
export const makeMitchellNetravali2 = () => makeSpline(0, 1/2);


export const linear = (x: number, v1: number, v2: number) => {
  return v1 * (1 - x) + v2 * x;
};

export const bilinear = (x: number, y: number, p00: number, p10: number, p01: number, p11: number) => {
  /* const v1 = linear(x, p00, p10);
  const v2 = linear(x, p01, p11);
  return linear(y, v1, v2);*/

  const a00 = p00;
  const a10 = p10 - p00;
  const a01 = p01 - p00;
  const a11 = p11 + p00 - (p10 + p01);
  return a00 + a10 * x + a01 * y + a11 * x * y;
};

export const cosine = (x: number, v1: number, v2: number) => {
  const v = (1 - Math.cos(Math.PI * x)) / 2;
  return v1 * (1 - v) + v2 * v;
};

export const bicosine = (x: number, y: number, p00: number, p10: number, p01: number, p11: number) => {
  /* const v1 = cosine(x, p00, p10);
  const v2 = cosine(x, p01, p11);
  return cosine(y, v1, v2);*/

  x = (1 - Math.cos(Math.PI * x)) / 2;
  y = (1 - Math.cos(Math.PI * y)) / 2;
  return bilinear(x, y, p00, p10, p01, p11);
};

export const cubic = (x: number, v0: number, v1: number, v2: number, v3: number) => {
  const xSquared = x * x;
  const a0 = v3 - v2 - v0 + v1;
  const a1 = v0 - v1 - a0;
  const a2 = v2 - v0;
  const a3 = v1;
  return a0 * x * xSquared + a1 * xSquared + a2 * x + a3;
};

// TODO refactor to make clearer
export const bicubic = (x: number, y: number, p00: number, p01: number, p02: number, p03: number, p10: number, p11: number, p12: number, p13: number, p20: number, p21: number, p22: number, p23: number, p30: number, p31: number, p32: number, p33: number) => {
  const yf2 = y * y;
  const xf2 = x * x;
  const xf3 = x * xf2;

  const x00 = p03 - p02 - p00 + p01;
  const x01 = p00 - p01 - x00;
  const x02 = p02 - p00;
  const x0 = x00*xf3 + x01*xf2 + x02*x + p01;

  const x10 = p13 - p12 - p10 + p11;
  const x11 = p10 - p11 - x10;
  const x12 = p12 - p10;
  const x1 = x10*xf3 + x11*xf2 + x12*x + p11;

  const x20 = p23 - p22 - p20 + p21;
  const x21 = p20 - p21 - x20;
  const x22 = p22 - p20;
  const x2 = x20*xf3 + x21*xf2 + x22*x + p21;

  const x30 = p33 - p32 - p30 + p31;
  const x31 = p30 - p31 - x30;
  const x32 = p32 - p30;
  const x3 = x30*xf3 + x31*xf2 + x32*x + p31;

  const y0 = x3 - x2 - x0 + x1;
  const y1 = x0 - x1 - y0;
  const y2 = x2 - x0;

  return y0 * y * yf2 + y1 * yf2 + y2 * y + x1;
};
