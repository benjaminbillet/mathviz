import { add, ComplexNumber, mul, powN } from '../utils/complex';
import { ComplexToComplexFunction } from '../utils/types';

const buildTerms = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]) => {
  if (coeffs.length != powers.length) {
    throw new Error('coeffs.length != powers.length');
  }
  if (multiplicators.length != powers.length) {
    throw new Error('coeffs.length != powers.length');
  }
  return powers.map((p, i) => {
    return { n: p, m: p - (pFold * multiplicators[i]), anm: coeffs[i] };
  });
}


export const makeP111RosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  return (z) => {
    const zConjugate = z.conjugate();

    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp = mul(mul(powN(z, term.n), powN(zConjugate, term.m)), term.anm);
      result = add(result, tmp, result);
    });
    return result;
  };
};

export const makeP211RosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  return (z) => {
    const zConjugate = z.conjugate();

    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp1 = mul(powN(z, term.n), powN(zConjugate, term.m));
      const tmp2 = mul(powN(z, -term.n), powN(zConjugate, -term.m));
      const tmp = mul(add(tmp1, tmp2), term.anm);
      result = add(result, tmp, result);
    });
    return result;
  };
};

export const makeP1M1RosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  return (z) => {
    const zConjugate = z.conjugate();

    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp1 = mul(powN(z, term.n), powN(zConjugate, term.m));
      const tmp2 = mul(powN(z, term.m), powN(zConjugate, term.n));
      const tmp = mul(add(tmp1, tmp2), term.anm);
      result = add(result, tmp, result);
    });
    return result;
  };
};

export const makeP11MRosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  return (z) => {
    const zConjugate = z.conjugate();

    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp1 = mul(powN(z, term.n), powN(zConjugate, term.m));
      const tmp2 = mul(powN(z, -term.m), powN(zConjugate, -term.n));
      const tmp = mul(add(tmp1, tmp2), term.anm);
      result = add(result, tmp, result);
    });
    return result;
  };
};

export const makeP11GRosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  return (z) => {
    const zConjugate = z.conjugate();

    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp1 = mul(powN(z, term.n), powN(zConjugate, term.m));
      const tmp2 = mul(mul(powN(z, -term.m), powN(zConjugate, -term.n)), Math.pow(-1, term.n + term.m));
      const tmp = mul(add(tmp1, tmp2), term.anm);
      result = add(result, tmp, result);
    });
    return result;
  };
};

export const makeP2MMRosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  return (z) => {
    const zConjugate = z.conjugate();

    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp1 = mul(powN(z, term.n), powN(zConjugate, term.m));
      const tmp2 = mul(powN(z, -term.n), powN(zConjugate, -term.m));
      const tmp3 = mul(powN(z, term.m), powN(zConjugate, term.n));
      const tmp4 = mul(powN(z, -term.m), powN(zConjugate, -term.n));

      const tmp = mul(add(add(add(tmp1, tmp2), tmp3), tmp4), term.anm);
      result = add(result, tmp, result);
    });
    return result;
  };
};

export const makeP2MGRosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  return (z) => {
    const zConjugate = z.conjugate();

    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp1 = mul(powN(z, term.n), powN(zConjugate, term.m));
      const tmp2 = mul(mul(powN(z, -term.m), powN(zConjugate, -term.n)), Math.pow(-1, term.n + term.m));
      const tmp3 = mul(powN(z, -term.n), powN(zConjugate, -term.m));
      const tmp4 = mul(mul(powN(z, term.m), powN(zConjugate, term.n)), Math.pow(-1, term.n + term.m));
      const tmp = mul(add(add(add(tmp1, tmp2), tmp3), tmp4), term.anm);
      result = add(result, tmp, result);
    });
    return result;
  };
};
