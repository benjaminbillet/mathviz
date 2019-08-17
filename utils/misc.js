import { randomIntegerWeighted, randomIntegerUniform, random, randomInteger } from './random';

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

export const shuffleArray = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.trunc(random() * (i + 1));
    let x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

export const findAllSubsets = (arr) => {
  const subsets = new Array(Math.pow(2, arr.length));
  for (let i = 0; i < subsets.length; i++) {
    subsets[i] = [];
    for (let j = 0; j < arr.length; j++) {
      // (1<<j) is a number with jth bit to 1, when we AND it with the subset number:
      // - we get 0 if j is not in the current subset
      // - or we get a positive number if j is in the current subset
      if ((i & (1 << j)) > 0) {
        subsets[i].push(arr[j]);
      }
    }
  }
  return subsets;
};

export const toParamsChainString = (obj) =>{
  return Object.keys(obj).reduce((prev, curr, idx) => {
    if (idx === 0) {
      return `${curr}=${obj[curr]}`;
    }
    return `${prev}-${curr}=${obj[curr]}`;
  }, null);
};

export const makeReservoirSampler = (k, f) => {
  const reservoir = [];
  let count = 0;

  return (...args) => {
    const result = f(...args);
    count++;
    if (reservoir.length < k) {
      reservoir.push(result);
    } else {
      const x = randomInteger(0, count);
      if (x < reservoir.length) {
        reservoir[x] = result;
      }
    }
    return result;
  };
};
