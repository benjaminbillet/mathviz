import { randomIntegerWeighted, randomIntegerUniform } from './random';

export const clamp = (x, min, max) => {
  return Math.max(min, Math.min(x, max));
};

export const clampInt = (x, min, max) => {
  return Math.trunc(clamp(x, min, max));
};

export const compose2dFunctions = (...functions) => {
  return (z) => functions.reduce((fz, t) => t(fz), z);
};

export const compose2dRandomizedFunctions = (functions, randomIntFunction) => {
  if (randomIntFunction == null) {
    randomIntFunction = randomIntegerUniform(0, functions.length);
  } else if (Array.isArray(randomIntFunction)) {
    randomIntFunction = randomIntegerWeighted(randomIntFunction);
  }
  return (z) => functions[randomIntFunction()](z);
};

export const toRadian = (degrees) => {
  return degrees * Math.PI / 180;
};

export const toDegree = (radian) => {
  return radian * 180 / Math.PI;
};
