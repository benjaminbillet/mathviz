import { randomIntegerWeighted, randomIntegerUniform, random } from './random';
import * as affine from '../utils/affine';

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
    const j = Math.trunc(random() * (i + 1));
    const x = a[i];
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

export const makeLowCutFilter = (threshold, attenuatedValue = 0) => {
  return (x) => {
    if (x <= threshold) {
      return attenuatedValue;
    }
    return x;
  };
};

export const makeHighCutFilter = (threshold, attenuatedValue = 0) => {
  return (x) => {
    if (x >= threshold) {
      return attenuatedValue;
    }
    return x;
  };
};

export const mapRange = (v, xmin, xmax, fxmin, fxmax) => {
  const xDelta = xmax - xmin;
  const fxDelta = fxmax - fxmin;
  const x = (v - xmin) / xDelta;
  return fxmin + x * fxDelta;
};

export const makeTransformMatrix = () => {
  let transformMatrix = affine.IDENTITY;
  const stack = [];
  return {
    push: () => stack.push(transformMatrix),
    pop: () => {
      transformMatrix = stack.pop();
      return transformMatrix;
    },
    transform: (...transforms) => {
      transformMatrix = affine.combine(
        transformMatrix,
        ...transforms,
      );
      return transformMatrix;
    },
    apply: (z) => affine.applyAffine2dFromMatrix(transformMatrix, z),
  };
};

export const evenify = (x) => {
  if (x % 2 === 0) {
    return x;
  }
  return x + 1;
}