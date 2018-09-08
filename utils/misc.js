export const clamp = (x, min, max) => {
  return Math.max(min, Math.min(x, max));
};

export const clampInt = (x, min, max) => {
  return Math.trunc(clamp(x, min, max));
};

export const compose2dFunctions = (...functions) => {
  return (z) => functions.reduce((fz, t) => t(fz), z);
};

export const compose2dFunctionsRandom = (functions, randomIntFunction) => {
  return (z) => functions[randomIntFunction()](z);
};

