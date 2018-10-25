import { makeAffine2d } from '../utils/affine';
import { compose2dFunctions, compose2dRandomizedFunctions } from '../utils/misc';

export const addAffineFunction = (ifs, coeffs, p) => {
  return addFunction(ifs, makeAffine2d(coeffs), p);
};

export const addFunction = (ifs, f, p) => {
  if (ifs == null || ifs.functions == null || ifs.probabilities == null) {
    return {
      functions: [ f ],
      probabilities: [ p ],
    };
  }
  return {
    functions: [ ...ifs.functions, f ],
    probabilities: [ ...ifs.probabilities, p ],
  };
};

export const makeIfs = (functions, probabilities) => {
  return {
    functions: [ ...functions ],
    probabilities: [ ...probabilities ],
  };
};

export const composeIfs = (...ifses) => {
  const composed = {
    functions: [],
    probabilities: [],
  };
  ifses.forEach((ifs) => {
    composed.functions = [ ...composed.functions, ...ifs.functions ];
    composed.probabilities = [ ...composed.probabilities, ...ifs.probabilities ];
  });

  composed.probabilities = composed.probabilities.map(x => x / ifses.length);
  return composed;
};

export const applyToIfs = (ifs, f) => {
  return {
    functions: ifs.functions.map(f2 => compose2dFunctions(f2, f)),
    probabilities: ifs.probabilities,
  };
};

export const normalizeProbabilities = (ifs) => {
  const sum = ifs.probabilities.reduce((total, x) => total + x, 0);
  return {
    functions: ifs.functions,
    probabilities: ifs.probabilities.map(x => x / sum),
  };
};

export const flattenIfs = ({ functions, probabilities }) => {
  return compose2dRandomizedFunctions(functions, probabilities);
};
