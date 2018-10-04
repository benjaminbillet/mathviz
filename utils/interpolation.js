export const makeLanczos = (a) => {
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

export const makeSpline = (a, b) => {
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
