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

export const kampyle = (n: number) => {
  const x = 1 / Math.sin(n);
  return complex(x, x * Math.tan(n));
};

export const rectangularHyperbola = (n: number) => {
  return complex(1 / Math.sin(n), Math.tan(n));
};

export const superformula = (n: number, a = 1, b = 1, m = 6, n1 = 1, n2 = 7, n3 = 8) => {
  const f1 = Math.pow(Math.abs(Math.cos(m * n / 4) / a), n2);
  const f2 = Math.pow(Math.abs(Math.sin(m * n / 4) / b), n3);
  const fr = Math.pow(f1 + f2, -1 / n1);
  return complex(Math.cos(n) * fr, Math.sin(n) * fr);
};
