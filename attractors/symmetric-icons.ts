import { complex, add, powN, div, mul, conjugate, modulus } from '../utils/complex';
import { Attractor } from '../utils/types';

// Symmetry in Chaos, appendix A

export const makeSymmetricIcon = (lambda: number, alpha: number, beta: number, gamma: number, omega: number, degree: number): Attractor => {
  return (z) => {
    /* const zn = z.pow(degree);
    const zn2 = new Complex(z.re, -z.im).pow(degree - 1);
    const r = lambda + alpha * (z.re * z.re + z.im * z.im) + beta * zn.re;
    return new Complex(r, omega).mul(z).add(zn2.mul(gamma));*/

    const zn = powN(z, degree);
    const r = lambda + alpha * (z.re * z.re + z.im * z.im) + beta * zn.re;

    let zn2 = complex(z.re, -z.im);
    zn2 = powN(zn2, degree - 1, zn2);
    zn2 = mul(zn2, gamma, zn2);

    let zr = complex(r, omega);
    zr = mul(zr, z, zr);
    zr = add(zr, zn2, zr);
    return zr;
  };
};

export const makeSymmetricIconWithNpTerm = (lambda: number, alpha: number, beta: number, gamma: number, delta: number, degree: number, p: number): Attractor => {
  return (z) => {
    /* const zn = z.pow(degree);
    const zn2 = new Complex(z.re, -z.im).pow(degree - 1);
    const mag = z.abs();
    const zn3 = z.div(mag).pow(degree * p);

    const r = lambda + alpha * (z.re * z.re + z.im * z.im) + beta * zn.re + delta * mag * zn3.re;
    return new Complex(r * z.re, r * z.im).add(zn2.mul(gamma));*/

    const zn = powN(z, degree);
    const mag = modulus(z);

    let zn2 = conjugate(z);
    zn2 = powN(zn2, degree - 1, zn2);
    zn2 = mul(zn2, gamma, zn2);

    let zn3 = div(z, mag);
    zn3 = powN(zn3, degree * p, zn3);

    const r = lambda + alpha * (z.re * z.re + z.im * z.im) + beta * zn.re + delta * mag * zn3.re;

    let zr = complex(r * z.re, r * z.im);
    zr = add(zr, zn2, zr);
    return zr;
  };
};
