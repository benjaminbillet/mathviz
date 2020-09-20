import { compose2dFunctions, compose2dRandomizedFunctions } from '../utils/misc';
import { Affine2D, ComplexToComplexFunction, Ifs } from '../utils/types';

export const addFunction = (ifs: Ifs, f: Affine2D, p: number) => {
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

export const makeIfs = (functions: Affine2D[], probabilities: number[]): Ifs => {
  return {
    functions: [ ...functions ],
    probabilities: [ ...probabilities ],
  };
};

export const composeIfs = (...ifses: Ifs[]) => {
  const composed: Ifs = {
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

export const applyToIfs = (ifs: Ifs, f: ComplexToComplexFunction) => {
  return {
    functions: ifs.functions.map(f2 => compose2dFunctions(f2, f)),
    probabilities: ifs.probabilities,
  };
};

export const normalizeProbabilities = (ifs: Ifs) => {
  const sum = ifs.probabilities.reduce((total, x) => total + x, 0);
  return {
    functions: ifs.functions,
    probabilities: ifs.probabilities.map(x => x / sum),
  };
};

export const flattenIfs = ({ functions, probabilities }: Ifs) => {
  return compose2dRandomizedFunctions(functions, probabilities);
};
