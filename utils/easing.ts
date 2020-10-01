// http://www.gizma.com/easing

import { EasingFunction } from './types';

export const linear: EasingFunction = x => x;

export const quadraticIn: EasingFunction = x => x * x;
export const quadraticOut: EasingFunction = x => x * (2 - x);
export const quadraticInOut: EasingFunction = (x) => {
  if (x < 0.5) {
    return 2 * x * x;
  }
  return -1 + (4 - 2 * x) * x;
};

export const cubicIn: EasingFunction = x => x * x * x;
export const cubicOut: EasingFunction = (x) => {
  x = x - 1;
  return x * x * x;
};
export const cubicInOut: EasingFunction = (x) => {
  if (x < 0.5) {
    return 4 * x * x * x;
  }
  const k = (2 * x - 2);
  return (x - 1) * k * k + 1;
};

export const quarticIn: EasingFunction = x => x * x * x * x;
export const quarticOut: EasingFunction = (x) => {
  x = x - 1;
  return 1 - x * x * x * x;
};
export const quarticInOut: EasingFunction = (x) => {
  if (x < 0.5) {
    return 8 * x * x * x * x;
  }
  x = x - 1;
  return 1 - 8 * x * x * x * x;
};

export const quinticIn: EasingFunction = x => x * x * x * x * x;
export const quinticOut: EasingFunction = (x) => {
  x = x - 1;
  return 1 + x * x * x * x * x;
};
export const quinticInOut: EasingFunction = (x) => {
  if (x < 0.5) {
    return 16 * x * x * x * x;
  }
  x = x - 1;
  return 1 + 16 * x * x * x * x;
};

export const sineIn: EasingFunction = x => -1 * Math.cos(x * Math.PI / 2) + 1;
export const sineOut: EasingFunction = x => Math.sin(x * Math.PI / 2) + 1;
export const sineInOut: EasingFunction = x => -0.5 * (Math.cos(x * Math.PI) - 1);

export const expIn: EasingFunction = x => Math.pow(2, 10 * (x - 1));
export const expOut: EasingFunction = x => Math.pow(2, -10 * x) + 1;
export const expInOut: EasingFunction = x => {
  if (x < 0.5) {
    return 0.5 * expIn(x);
  }
  return 0.5 * (expOut(x) + 1);
};
