import { randomIntegerWeighted, randomIntegerUniform, random, pickRandom } from './random';
import * as affine from '../utils/affine';
import { Optional, ComplexToComplexFunction, IterableRealFunction, RealToRealFunction, TransformMatrix, Struct, Collection, Circle } from './types';
import { complex, ComplexNumber } from './complex';
import { euclidean, euclidean2d } from './distance';
import { Matrix } from './matrix';

export const clamp = (x: number, min: number, max: number) => {
  return Math.max(min, Math.min(x, max));
};

export const clampInt = (x: number, min: number, max: number) => {
  return Math.trunc(clamp(x, min, max));
};

export const compose2dFunctions = (...functions: ComplexToComplexFunction[]): ComplexToComplexFunction => {
  return (z) => functions.reduce((fz, t) => t(fz), z);
};

export const compose2dRandomizedFunctions = (functions: ComplexToComplexFunction[], randomIntFunction?: IterableRealFunction | number[]): ComplexToComplexFunction => {
  if (randomIntFunction == null) {
    randomIntFunction = randomIntegerUniform(0, functions.length);
  } else if (Array.isArray(randomIntFunction)) {
    randomIntFunction = randomIntegerWeighted(randomIntFunction);
  }
  return (z) => functions[randomIntFunction()](z);
};

export const shuffleArray = <T> (a: Collection<T>): Collection<T> => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.trunc(random() * (i + 1));
    const x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

export enum ExpandMode {
  ROTATE,
  COPY,
  RANDOM
};
export const expandArray = <T> (a: Collection<T>, newSize: number, mode = ExpandMode.RANDOM): Collection<T> => {
  if (newSize <= a.length) {
    return a.slice(0, newSize);
  }
  const result = [ ...a ];
  for (let i = a.length; i < newSize; i++) {
    switch (mode) {
      case ExpandMode.ROTATE:
        result.push(a[i % a.length]);
        break;
      case ExpandMode.COPY:
        result.push(a[a.length - 1]);
        break;
      case ExpandMode.RANDOM:
        result.push(pickRandom(a));
        break;
    }
  }
  return result;
};

export const findAllSubsets = (arr: any[]) => {
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

export const toParamsChainString = (obj: Struct) =>{
  return Object.keys(obj).reduce((prev, curr, idx) => {
    if (idx === 0) {
      return `${curr}=${obj[curr]}`;
    }
    return `${prev}-${curr}=${obj[curr]}`;
  }, '');
};

export const makeLowCutFilter = (threshold: number, attenuatedValue = 0): RealToRealFunction => {
  return (x) => {
    if (x <= threshold) {
      return attenuatedValue;
    }
    return x;
  };
};

export const makeHighCutFilter = (threshold: number, attenuatedValue = 0): RealToRealFunction => {
  return (x) => {
    if (x >= threshold) {
      return attenuatedValue;
    }
    return x;
  };
};

export const mapRange = (v: number, xmin: number, xmax: number, fxmin: number, fxmax: number) => {
  const xDelta = xmax - xmin;
  const fxDelta = fxmax - fxmin;
  const x = (v - xmin) / xDelta;
  return fxmin + x * fxDelta;
};

export const makeTransformMatrix = (initial = affine.IDENTITY): TransformMatrix => {
  let transformMatrix: Matrix = initial;
  let func: Optional<ComplexToComplexFunction> = null;
  const stack: Matrix[] = [];
  return {
    push: () => stack.push(transformMatrix),
    pop: () => {
      func = null;
      transformMatrix = stack.pop() || initial;
      return transformMatrix;
    },
    transform: (...transforms: Matrix[]) => {
      func = null;
      transformMatrix = affine.combine(
        transformMatrix,
        ...transforms,
      );
      return transformMatrix;
    },
    apply: (z: ComplexNumber) => {
      if (func == null) {
        func = affine.makeAffine2dFromMatrix(transformMatrix);
      }
      return func(z);
    }
  };
};

export const evenify = (x: number) => {
  if (x % 2 === 0) {
    return x;
  }
  return x + 1;
}

// http://mathforum.org/library/drmath/view/53027.html
export const findCircleCenter = (x1: number, y1: number, x2: number, y2: number, radius: number, exterior: boolean) => {
  const q = euclidean2d(x1, y1, x2, y2);
  const x3 = (x1 + x2) / 2;
  const y3 = (y1 + y2) / 2;

  const basex = euclidean(radius, q / 2) * (y1 - y2) / q;
  const basey = euclidean(radius, q / 2) * (x2 - x1) / q;

  if (exterior) {
    return [ x3 - basex, y3 - basey ]; 
  }
  return [ x3 + basex, y3 + basey ]; 
}

// http://www.ambrsoft.com/trigocalc/circle3d.htm
export const findCircle = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Circle => {
  const a = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
  const b = (x1 * x1 + y1 * y1) * (y3 - y2) + (x2 * x2 + y2 * y2) * (y1 - y3) + (x3 * x3 + y3 * y3) * (y2 - y1);
  const c = (x1 * x1 + y1 * y1) * (x2 - x3) + (x2 * x2 + y2 * y2) * (x3 - x1) + (x3 * x3 + y3 * y3) * (x1 - x2);
  const d = (x1 * x1 + y1 * y1) * (x3 * y2 - x2 * y3) + (x2 * x2 + y2 * y2) * (x1 * y3 - x3 * y1) + (x3 * x3 + y3 * y3) * (x2 * y1 - x1 * y2);

  const center = complex(-b / (2 * a), -c / (2 * a));
  const radius = Math.sqrt((b * b + c * c - 4 * a * d) / (4 * a * a));
  return { center, radius };
}