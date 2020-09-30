import math from '../utils/math';

export const i = (): ComplexNumber => {
  return complex(0, 1);
};

export const complex = (re = 0, im = 0, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = new ComplexNumber(re, im);
  }
  out.re = re;
  out.im = im;
  return out;
};

export const eulerComplex = (phi = 0, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = new ComplexNumber(math.cos(phi), math.sin(phi));
  }
  out.re = math.cos(phi);
  out.im = math.sin(phi);
  return out;
};


export const modulus = (z: ComplexNumber): number => {
  return math.sqrt(z.re * z.re + z.im * z.im);
};

export const squaredModulus = (z: ComplexNumber): number => {
  return z.re * z.re + z.im * z.im;
};

export const lnModulus = (z: ComplexNumber): number => {
  return Math.log(z.re * z.re + z.im * z.im) * 0.5;
};

export const argument = (z: ComplexNumber): number => {
  return math.atan2(z.im, z.re);
};

export const negative = (z: ComplexNumber, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  out.re = - z.re;
  out.im = - z.im;
  return out;
};

export const conjugate = (z: ComplexNumber, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  out.re = z.re;
  out.im = - z.im;
  return out;
};

export const add = (z1: ComplexNumber, z2: ComplexNumber | number, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  if (typeof z2 === "number") {
    out.re = z1.re + z2;
    out.im = z1.im;
    return out;
  }
  out.re = z1.re + z2.re;
  out.im = z1.im + z2.im;
  return out;
};

export const sub = (z1: ComplexNumber, z2: ComplexNumber | number, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  if (typeof z2 === "number") {
    out.re = z1.re - z2;
    out.im = z1.im;
    return out;
  }

  out.re = z1.re - z2.re;
  out.im = z1.im - z2.im;
  return out;
};

export const mul = (z1: ComplexNumber, z2: ComplexNumber | number, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }

  if (typeof z2 === "number") {
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

export const pow2 = (z: ComplexNumber, out?: ComplexNumber): ComplexNumber => {
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

export const powN = (z: ComplexNumber, n: number, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  // (a+ib)^N=r^N(cos(Nθ)+isin(Nθ))

  const rPowN = Math.exp(lnModulus(z) * n); // optimized r^N
  const nTheta = math.atan2(z.im, z.re) * n;

  out.re = rPowN * math.cos(nTheta);
  out.im = rPowN * math.sin(nTheta);
  return out;
};

export const pow = (z1: ComplexNumber, z2: ComplexNumber, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  const logr = lnModulus(z1);
  const arg = math.atan2(z1.im, z1.re);

  const a = Math.exp(logr * z2.re - arg * z2.im);
  const b = logr * z2.im + arg * z2.re;

  out.re = a * math.cos(b);
  out.im = a * math.sin(b);
  return out;
};

export const ln = (z: ComplexNumber, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  const logr = lnModulus(z);
  const arg = math.atan2(z.im, z.re);

  out.re = logr;
  out.im = arg;
  return out;
};

export const logb = (z: ComplexNumber, base: number, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  return ln(z, out).div(Math.log(base), out);
};

export const reciprocal = (z: ComplexNumber, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  const rSquared = squaredModulus(z);
  out.re = z.re / rSquared;
  out.im = - z.im / rSquared;
  return out;
};

export const div = (z1: ComplexNumber, z2: ComplexNumber | number, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }

  if (typeof z2 === "number") {
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

export const sqrt = (z: ComplexNumber, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  const m = modulus(z);
  const r = z.re;
  const i = z.im;

  out.re = math.sqrt((r + m) / 2);
  out.im = math.sign(i) * math.sqrt((m - r) / 2);
  return out;
};

export const sin = (z: ComplexNumber, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  const re = z.re;
  const im = z.im;
  out.re = Math.sin(re) * Math.cosh(im);
  out.im = Math.cos(re) * Math.sinh(im);
  return out;
};

export const cos = (z: ComplexNumber, out?: ComplexNumber): ComplexNumber => {
  if (out == null) {
    out = complex();
  }
  const re = z.re;
  const im = z.im;
  out.re = Math.cos(re) * Math.cosh(im);
  out.im = Math.sin(re) * Math.sinh(im);
  return out;
};

export const equals = (z1: ComplexNumber, z2: ComplexNumber): boolean => {
  return z1.re === z2.re && z1.im === z2.im;
};

export const normalize = (z: ComplexNumber, out?: ComplexNumber) => {
  return div(z, modulus(z), out);
}

export class ComplexNumber {
  re: number = 0;
  im: number = 0;

  constructor(re: number | ComplexNumber, im?: number) {
    this.set(re, im);
  }

  set(re: number | ComplexNumber, im?: number) {
    if (typeof re === 'number') {
      this.re = re;
      if (im != null) {
        this.im = im;
      } else {
        this.im = re;
      }
    } else {
      this.re = re.re;
      this.im = re.im;
    }
  }

  modulus() {
    return modulus(this);
  };

  squaredModulus() {
    return squaredModulus(this);
  };

  lnModulus() {
    return lnModulus(this);
  };

  argument() {
    return argument(this);
  };

  conjugate(out?: ComplexNumber) {
    return conjugate(this, out);
  };

  negative(out?: ComplexNumber) {
    return negative(this, out);
  }

  add(z: ComplexNumber | number, out?: ComplexNumber) {
    return add(this, z, out);
  };

  sub(z: ComplexNumber | number, out?: ComplexNumber) {
    return sub(this, z, out);
  };

  mul(z: ComplexNumber | number, out?: ComplexNumber) {
    return mul(this, z, out);
  };

  pow2(out?: ComplexNumber) {
    return pow2(this, out);
  };

  powN(n: number, out?: ComplexNumber) {
    return powN(this, n, out);
  };

  pow(z: ComplexNumber, out?: ComplexNumber) {
    return pow(this, z, out);
  };

  ln(out?: ComplexNumber) {
    return ln(this, out);
  };

  reciprocal(out?: ComplexNumber) {
    return reciprocal(this, out);
  };

  div(z: ComplexNumber | number, out?: ComplexNumber) {
    return div(this, z, out);
  };

  sqrt(out?: ComplexNumber) {
    return sqrt(this, out);
  };

  sin(out?: ComplexNumber) {
    return sin(this, out);
  };
  
  cos(out?: ComplexNumber) {
    return cos(this, out);
  };
  
  equals(z: ComplexNumber) {
    return equals(this, z);
  }

  normalize(out?: ComplexNumber) {
    return normalize(this, out);
  }
};