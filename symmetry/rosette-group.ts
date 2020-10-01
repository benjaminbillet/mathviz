import { add, ComplexNumber, mul, powN } from '../utils/complex';
import { ComplexToComplexFunction } from '../utils/types';



/*
[
  {
    n: 5,
    m: 0,
    anm: { re: 0.38073430652730167, im: 0.10354519565589726 }
  },
  {
    n: 6,
    m: 1,
    anm: { re: 0.40917709097266197, im: 0.18898376310244203 }
  },
  {
    n: 3,
    m: -2,
    anm: { re: 0.16127071937080473, im: 0.4988287640735507 }
  },
  {
    n: 7,
    m: 2,
    anm: { re: 0.46642857568804175, im: 0.16886185272596776 }
  }
]*/

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
  console.log(terms);
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


export const makeP1M1RosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  console.log(terms);
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

export const makeP211RosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  console.log(terms);
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

export const makeP11MRosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  console.log(terms);
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
  console.log(terms);
  return (z) => {
    const zConjugate = z.conjugate();

    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp1 = mul(mul(powN(z, term.n), powN(zConjugate, term.m)), Math.pow(-1, term.n + term.m));
      const tmp2 = mul(powN(z, -term.m), powN(zConjugate, -term.n));
      const tmp = mul(add(tmp1, tmp2), term.anm);
      result = add(result, tmp, result);
    });
    return result;
  };
};

export const makeP2MMRosetteFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  const terms = buildTerms(pFold, powers, coeffs, multiplicators);
  console.log(terms);
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
  console.log(terms);
  return (z) => {
    const zConjugate = z.conjugate();

    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp1 = mul(mul(powN(z, term.n), powN(zConjugate, term.m)), Math.pow(-1, term.n + term.m));
      const tmp2 = mul(mul(powN(z, -term.n), powN(zConjugate, -term.m)), Math.pow(-1, term.n + term.m));
      const tmp3 = mul(powN(z, term.m), powN(zConjugate, term.n));
      const tmp4 = mul(powN(z, -term.m), powN(zConjugate, -term.m));
      const tmp = add(add(add(tmp1, tmp2), tmp3), tmp4);
      result = add(result, tmp, result);
    });
    return result;
  };
};
