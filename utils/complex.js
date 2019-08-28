import math from '../utils/math';

export const complex = (re = 0, im = 0, out = undefined) => {
  if (out == null) {
    out = { re, im };
  }
  out.re = re;
  out.im = im;
  return out;
};

export const modulus = (z) => {
  return math.sqrt(z.re * z.re + z.im * z.im);
};

export const squaredModulus = (z) => {
  return z.re * z.re + z.im * z.im;
};

export const logModulus = (z) => {
  return Math.log(z.re * z.re + z.im * z.im) * 0.5;
};

export const argument = (z) => {
  return math.atan2(z.im, z.re);
};

export const conjugate = (z, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  out.re = z.re;
  out.im = - z.im;
  return out;
};

export const add = (z1, z2, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  if (z2.re == null) { // treat as real
    out.re = z1.re + z2;
    out.im = z1.im;
    return out;
  }
  out.re = z1.re + z2.re;
  out.im = z1.im + z2.im;
  return out;
};

export const sub = (z1, z2, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  if (z2.re == null) { // treat as real
    out.re = z1.re - z2;
    out.im = z1.im;
    return out;
  }

  out.re = z1.re - z2.re;
  out.im = z1.im - z2.im;
  return out;
};

export const mul = (z1, z2, out = undefined) => {
  if (out == null) {
    out = complex();
  }

  if (z2.re == null) { // treat as real
    out.re = z1.re * z2;
    out.im = z1.im * z2;
    return out;
  }

  const r1 = z1.re;
  const i1 = z1.im;
  const r2 = z2.re;
  const i2 = z2.im;

  out.re = r1 * r2 - i1 * i2;
  out.im = r1 * i2 + i1 * r2;
  return out;
};

export const pow2 = (z, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  // (a+ib)^N=r^N(cos(Nθ)+isin(Nθ))

  const rSquared = squaredModulus(z); // optimized r^2
  const twiceTheta = 2 * math.atan2(z.im, z.re);

  out.re = rSquared * math.cos(twiceTheta);
  out.im = rSquared * math.sin(twiceTheta);
  return out;
};

export const powN = (z, n, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  // (a+ib)^N=r^N(cos(Nθ)+isin(Nθ))

  const rPowN = Math.exp(logModulus(z) * n); // optimized r^N
  const nTheta = math.atan2(z.im, z.re) * n;

  out.re = rPowN * math.cos(nTheta);
  out.im = rPowN * math.sin(nTheta);
  return out;
};

export const pow = (z1, z2, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  const logr = logModulus(z1);
  const arg = math.atan2(z1.im, z1.re);

  const a = Math.exp(logr * z2.re - arg * z2.im);
  const b = logr * z2.im + arg * z2.re;

  out.re = a * math.cos(b);
  out.im = a * math.sin(b);
  return out;
};

export const log = (z, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  const logr = logModulus(z);
  const arg = math.atan2(z.im, z.re);

  out.re = logr;
  out.im = arg;
  return out;
};

export const reciprocal = (z, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  const rSquared = squaredModulus(z);
  out.re = z.re / rSquared;
  out.im = - z.im / rSquared;
  return out;
};

export const div = (z1, z2, out = undefined) => {
  if (out == null) {
    out = complex();
  }

  if (z2.re == null) { // treat as real
    out.re = z1.re / z2;
    out.im = z1.im / z2;
    return out;
  }

  const r1 = z1.re;
  const i1 = z1.im;
  const r2 = z2.re;
  const i2 = z2.im;

  const inverseSquaredModulus = 1 / squaredModulus(z2);
  out.re = inverseSquaredModulus * (r1 * r2 + i1 * i2);
  out.im = inverseSquaredModulus * (r1 * i2 - i1 * r2);
  return out;
};

export const sqrt = (z, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  const modulus = modulus(z);
  const r = z.re;
  const i = z.im;

  out.re = math.sqrt((r + modulus) / 2);
  out.im = math.sign(i) * math.sqrt((modulus - r) / 2);
  return out;
};

export const sin = (z, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  const re = z.re;
  const im = z.im;
  out.re = Math.sin(re) * Math.cosh(im);
  out.im = Math.cos(re) * Math.sinh(im);
  return out;
};

export const cos = (z, out = undefined) => {
  if (out == null) {
    out = complex();
  }
  const re = z.re;
  const im = z.im;
  out.re = Math.cos(re) * Math.cosh(im);
  out.im = Math.sin(re) * Math.sinh(im);
  return out;
};

export class ImmutableComplex {
  constructor(re, im) {
    if (im == null) { // arg is object
      this.re = re.re;
      this.im = re.im;
    } else {
      this.re = re;
      this.im = im;
    }
  }

  modulus() {
    return modulus(this);
  };

  squaredModulus() {
    return squaredModulus(this);
  };

  logModulus() {
    return logModulus(this);
  };

  argument() {
    return argument(this);
  };

  conjugate() {
    return new ImmutableComplex(conjugate(this));
  };

  add(z) {
    return new ImmutableComplex(add(this, z));
  };

  sub(z) {
    return new ImmutableComplex(sub(this, z, this));
  };

  mul(z) {
    return new ImmutableComplex(mul(this, z, this));
  };

  pow2() {
    return new ImmutableComplex(pow2(this, this));
  };

  powN(n) {
    return new ImmutableComplex(powN(this, n, this));
  };

  pow(z) {
    return new ImmutableComplex(pow(this, z, this));
  };

  reciprocal() {
    return new ImmutableComplex(reciprocal(this));
  };

  div(z) {
    return new ImmutableComplex(div(this, z, this));
  };

  sqrt() {
    return new ImmutableComplex(sqrt(this, this));
  };
};

export class MutableComplex {
  constructor(re, im) {
    if (im == null) { // arg is object
      this.re = re.re;
      this.im = re.im;
    } else {
      this.re = re;
      this.im = im;
    }
  }

  modulus() {
    return modulus(this);
  };

  squaredModulus() {
    return squaredModulus(this);
  };

  logModulus() {
    return logModulus(this);
  };

  argument() {
    return argument(this);
  };

  conjugate() {
    return conjugate(this, this);
  };

  add(z) {
    return add(this, z, this);
  };

  sub(z) {
    return sub(this, z, this);
  };

  mul(z) {
    return mul(this, z, this);
  };

  pow2() {
    return pow2(this, this);
  };

  powN(n) {
    return powN(this, n, this);
  };

  pow(z) {
    return pow(this, z, this);
  };

  reciprocal() {
    return reciprocal(this);
  };

  div(z) {
    return div(this, z, this);
  };

  sqrt() {
    return sqrt(this, this);
  };
};
