import Complex from 'complex.js';

// Symmetry in Chaos, appendix A

export const makeSymmetricIcon = (lambda, alpha, beta, gamma, omega, degree) => {
  return (z) => {
    const zn = z.pow(degree);
    const zn2 = new Complex(z.re, -z.im).pow(degree - 1);
    const r = lambda + alpha * (z.re * z.re + z.im * z.im) + beta * zn.re;
    return new Complex(r, omega).mul(z).add(zn2.mul(gamma));
  };
};

export const makeSymmetricIconWithNpTerm = (lambda, alpha, beta, gamma, delta, degree, p) => {
  return (z) => {
    const zn = z.pow(degree);
    const zn2 = new Complex(z.re, -z.im).pow(degree - 1);
    const mag = z.abs();
    const zn3 = z.div(mag).pow(degree * p);

    const r = lambda + alpha * (z.re * z.re + z.im * z.im) + beta * zn.re + delta * mag * zn3.re;
    return new Complex(r * z.re, r * z.im).add(zn2.mul(gamma));
  };
};
