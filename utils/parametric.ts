import { complex } from './complex';

export const circle = (n: number) => { // polar to cartesian coordinates
  return complex(Math.cos(n), Math.sin(n));
};

export const astroid = (n: number) => {
  const sinn = Math.sin(n);
  const cosn = Math.cos(n);
  return complex(sinn * sinn * sinn, cosn * cosn * cosn);
};

export const cissoid = (n: number) => {
  let x = Math.sin(n);
  x = 2 * x * x;
  return complex(x, x * Math.tan(n));
};

export const epicycloid = (n: number, k = 19/5) => {
  const r = 1;
  const R = k * r;

  return complex(
    (R + r) * Math.cos(n) - r * Math.cos(n * (R + r) / r),
    (R + r) * Math.sin(n) - r * Math.sin(n * (R + r) / r)
  );
};

export const epitrochoid = (n: number, r = 1, R = 3, d = 0.5) => {
  return complex(
    (R + r) * Math.cos(n) - d * Math.cos(n * (R + r) / r),
    (R + r) * Math.sin(n) - d * Math.sin(n * (R + r) / r)
  );
};

export const hypocycloid = (n: number, k = 19/5) => {
  const r = 1;
  const R = k * r;

  return complex(
    (R - r) * Math.cos(n) + r * Math.cos(n * (R - r) / r),
    (R - r) * Math.sin(n) - r * Math.sin(n * (R - r) / r)
  );
};

export const hypotrochoid = (n: number, r = 3, R = 5, d = 5) => {
  return complex(
    (R - r) * Math.cos(n) + d * Math.cos(n * (R - r) / r),
    (R - r) * Math.sin(n) - d * Math.sin(n * (R - r) / r)
  );
};

export const logSpiral = (n: number, a = 1, alpha = 1.22) => { // alpha is an angle
  const b = 1 / Math.tan(alpha); // cotangeant
  if (isNaN(b)) {
    throw new Error(`undefined for ${n}`);
  }
  return complex(
    a * Math.exp(b * n) * Math.cos(n),
    a * Math.exp(b * n) * Math.sin(n),
  );
};

export const kampyle = (n: number) => {
  const x = 1 / Math.cos(n); // secant
  if (isNaN(x)) {
    throw new Error(`undefined for ${n}`);
  }
  return complex(x, x * Math.tan(n));
};

export const rectangularHyperbola = (n: number) => {
  const x = 1 / Math.sin(n); // cosecant
  if (isNaN(x)) {
    throw new Error(`undefined for ${n}`);
  }
  return complex(x, Math.tan(n));
};

export const superformula = (n: number, a = 1, b = 1, m = 6, n1 = 1, n2 = 7, n3 = 8) => {
  const f1 = Math.pow(Math.abs(Math.cos(m * n / 4) / a), n2);
  const f2 = Math.pow(Math.abs(Math.sin(m * n / 4) / b), n3);
  const fr = Math.pow(f1 + f2, -1 / n1);
  return complex(Math.cos(n) * fr, Math.sin(n) * fr);
};
