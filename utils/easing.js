// http://www.gizma.com/easing

export const linear = x => x;

export const quadraticIn = x => x * x;
export const quadraticOut = x => x * (2 - x);
export const quadraticInOut = (x) => {
  if (x < 0.5) {
    return 2 * x * x;
  }
  return -1 + (4 - 2 * x) * x;
};

export const cubicIn = x => x * x * x;
export const cubicOut = (x) => {
  x = x - 1;
  return x * x * x;
};
export const cubicInOut = (x) => {
  if (x < 0.5) {
    return 4 * x * x * x;
  }
  const k = (2 * x - 2);
  return (x - 1) * k * k + 1;
};

export const quarticIn = x => x * x * x * x;
export const quarticOut = (x) => {
  x = x - 1;
  return 1 - x * x * x * x;
};
export const quarticInOut = (x) => {
  if (x < 0.5) {
    return 8 * x * x * x * x;
  }
  x = x - 1;
  return 1 - 8 * x * x * x * x;
};

export const quinticIn = x => x * x * x * x * x;
export const quinticOut = (x) => {
  x = x - 1;
  return 1 + x * x * x * x * x;
};
export const quinticInOut = (x) => {
  if (x < 0.5) {
    return 16 * x * x * x * x;
  }
  x = x - 1;
  return 1 + 16 * x * x * x * x;
};

export const sineIn = x => -1 * Math.cos(x * Math.PI / 2) + 1;
export const sineOut = x => Math.sin(x * Math.PI / 2) + 1;
export const sineInOut = x => -0.5 * (Math.cos(x * Math.PI) - 1);

export const expIn = x => Math.pow(2, 10 * (x - 1));
export const expOut = x => Math.pow(2, -10 * x) + 1;
export const expInOut = x => (x) => {
  if (x < 0.5) {
    return 0.5 * expIn(x);
  }
  return 0.5 * (expOut(x) + 1);
};
