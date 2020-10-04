import { complex, ComplexNumber, eulerComplex } from '../utils/complex';
import { TWO_PI } from '../utils/math';
import { ComplexToComplexFunction } from '../utils/types';
import { makeP111RosetteFunction, makeP11GRosetteFunction, makeP11MRosetteFunction, makeP1M1RosetteFunction, makeP211RosetteFunction, makeP2MGRosetteFunction, makeP2MMRosetteFunction } from './rosette-group';

const SQRT_3 = Math.sqrt(3);


export const makeAveragedFunctionSum = (functions: ComplexToComplexFunction[]): ComplexToComplexFunction => {
  const factor = 1 / functions.length;
  return (z) => functions.reduce((fz, f) => fz.add(f(z), fz), complex(0, 0)).mul(factor);
}

const enm = (x: number, y: number, n: number, m: number) => eulerComplex(TWO_PI * (n * x + m * y));

export const makeEnmRectangularLattice = (l: number, n: number, m: number): ComplexToComplexFunction => {
  return (z) => {
    const X = z.re;
    const Y = z.im / l; // if l = 1 we have a square lattice
    return enm(X, Y, n, m);
  }
}

export const makeEnmGenericLattice = (xi: number, eta: number, n: number, m: number): ComplexToComplexFunction => {
  return (z) => {
    const Y = z.im / eta;
    const X = z.re - xi * Y;
    return enm(X, Y, n, m);
  }
}

export const makeEnmRhombicLattice = (b: number, n: number, m: number): ComplexToComplexFunction => {
  return (z) => {
    const factor = z.im / (2 * b);
    const X = z.re + factor;
    const Y = z.re - factor
    return enm(X, Y, n, m);
  }
}

export const makeEnmHexagonalLattice = (n: number, m: number): ComplexToComplexFunction => {
  return (z) => {
    const factor = z.im / SQRT_3;
    const X = z.re + factor;
    const Y = 2 * factor
    return enm(X, Y, n, m);
  }
}

export const makeEnmSquareLattice = (n: number, m: number): ComplexToComplexFunction => {
  return (z) => {
    return enm(z.re, z.im, n, m);
  }
}

export const makeWnm = (n: number, m: number): ComplexToComplexFunction => {
  return makeAveragedFunctionSum([
    makeEnmHexagonalLattice(n, m),
    makeEnmHexagonalLattice(m, -(n + m)),
    makeEnmHexagonalLattice(-(n + m), n),
  ]);
}

export const makeCnm = (b: number, n: number, m: number): ComplexToComplexFunction => {
  return makeAveragedFunctionSum([
    makeEnmRhombicLattice(b, n, m),
    makeEnmRhombicLattice(b, m, n),
  ]);
}

export const makeTnm = (l: number, n: number, m: number): ComplexToComplexFunction => {
  return makeAveragedFunctionSum([
    makeEnmRectangularLattice(l, n, m),
    makeEnmRectangularLattice(l, -n, -m),
  ]);
}

export const makeSnm = (n: number, m: number): ComplexToComplexFunction => {
  return makeAveragedFunctionSum([
    makeEnmSquareLattice(n, m),
    makeEnmSquareLattice(m, -n),
    makeEnmSquareLattice(-n, -m),
    makeEnmSquareLattice(-m, n),
  ]);
}

type Term = { f: ComplexToComplexFunction, a: ComplexNumber }
const buildWallpaperFunction = (terms: Term[]): ComplexToComplexFunction => {
  return (z) => {
    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp = term.f(z).mul(term.a);
      result = result.add(tmp, result);
    });
    return result;
  };
};

const checkParams = (nValues: number[], mValues: number[], aValues: ComplexNumber[]) => {
  if (nValues.length != mValues.length) {
    throw new Error('nValues.length != mValues.length');
  }
  if (nValues.length != aValues.length) {
    throw new Error('nValues.length != aValues.length');
  }
}

export const makePMMWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, n, -m), a: a.mul(Math.pow(-1, n)) });
  });
  return buildWallpaperFunction(terms);
};

export const makePGGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, n, -m), a: a.mul(Math.pow(-1, n + m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makeP1WallpaperFunction = (xi: number, eta: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeEnmGenericLattice(xi, eta, n, m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP2WallpaperFunction = (xi: number, eta: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeEnmGenericLattice(xi, eta, n, m), a });
    terms.push({ f: makeEnmGenericLattice(xi, eta, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeEnmRectangularLattice(l, n, m), a });
    terms.push({ f: makeEnmRectangularLattice(l, -n, m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeEnmRectangularLattice(l, n, m), a });
    terms.push({ f: makeEnmRectangularLattice(l, -n, m), a: a.mul(Math.pow(-1, m)) });
  });
  return buildWallpaperFunction(terms);
};


export const makeCMWallpaperFunction = (b: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeCnm(b, n, m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeCMMWallpaperFunction = (b: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeCnm(b, n, m), a });
    terms.push({ f: makeCnm(b, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP3WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(m, - n - m), a });
    terms.push({ f: makeWnm(- n - m, n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP31MWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(m, n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP3M1WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(-m, -n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4MWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(m, n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4GWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(m, n), a: a.mul(Math.pow(-1, n + m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makeP6MWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(- n, - m), a });
    terms.push({ f: makeWnm(m, n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP6WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(-n, -m), a });
  });
  return buildWallpaperFunction(terms);
};