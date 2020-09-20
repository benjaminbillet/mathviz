export const circularDistance = (current: number, next: number, mod: number) => {
  return Math.min(forwardCircularDistance(current, next, mod), backwardCircularDistance(current, next, mod));
};

export const forwardCircularDistance = (current: number, next: number, mod: number) => {
  if (next >= current) {
    return next - current;
  }
  return next + mod - current;
};

export const backwardCircularDistance = (current: number, next: number, mod: number) => {
  return forwardCircularDistance(next, current, mod);
};

export const manhattan = (a: number, b: number) => {
  return Math.abs(a) + Math.abs(b);
};

export const manhattan2d = (x1: number, y1: number, x2: number, y2: number) => {
  return manhattan(x1 - x2, y1 - y2);
};

/* export const manhattanNd = (p, q) => {
  return p.reduce((d, pi, i) => d + Math.abs(pi - q[i]), 0);
};*/

export const euclideanSquared = (a: number, b: number) => {
  return a * a + b * b;
};

export const euclideanSquared2d = (x1: number, y1: number, x2: number, y2: number) => {
  return euclideanSquared(x1 - x2, y1 - y2);
};


export const euclidean = (a: number, b: number) => {
  return Math.sqrt(a * a + b * b);
};

export const euclidean2d = (x1: number, y1: number, x2: number, y2: number) => {
  return euclidean(x1 - x2, y1 - y2);
};

export const chebyshev = (a: number, b: number) => {
  return Math.max(Math.abs(a), Math.abs(b));
};

export const chebyshev2d = (x1: number, y1: number, x2: number, y2: number) => {
  return chebyshev(x1 - x2, y1 - y2);
};


export const minkowski = (x: number, y: number, p: number) => {
  return Math.pow(Math.pow(Math.abs(x), p) + Math.pow(Math.abs(y), p), 1 / p);
};

export const makeMinkowski = (p: number) => {
  return (x: number, y: number) => minkowski(x, y, p);
};

export const minkowski2d = (x1: number, y1: number, x2: number, y2: number, p: number) => {
  return Math.pow(Math.pow(Math.abs(x1 - x2), p) + Math.pow(Math.abs(y1 - y2), p), 1 / p);
};

export const makeMinkowski2d = (p: number) => {
  return (x1: number, y1: number, x2: number, y2: number) => minkowski2d(x1, y1, x2, y2, p);
};

export const karlsruhe2d = (x1: number, y1: number, x2: number, y2: number) => {
  const r1 = euclidean(x1, y1);
  const r2 = euclidean(x2, y2);

  const phi1 = Math.atan2(y1, x1);
  const phi2 = Math.atan2(y2, x2);

  const deltaPhi = Math.abs(phi1 - phi2);
  const delta = Math.min(deltaPhi, 2 * Math.PI - deltaPhi);

  if (delta >= 0 && delta <= 2) {
    return Math.min(r1, r2) * deltaPhi + Math.abs(r1 - r2);
  }
  return r1 + r2;
};

export const akritean = (x: number, y: number, a = 0.5) => {
  return euclidean(x, y) * (1 - a) + manhattan(x, y) * a;
};

export const akritean2d = (x1: number, y1: number, x2: number, y2: number, a = 0.5) => {
  return euclidean2d(x1, y1, x2, y2) * (1 - a) + manhattan2d(x1, y1, x2, y2) * a;
};

export const makeAkritean = (a: number) => {
  return (x: number, y: number) => akritean(x, y, a);
};

export const makeAkritean2d = (a: number) => {
  return (x1: number, y1: number, x2: number, y2: number) => akritean2d(x1, y1, x2, y2, a);
};


export const discrete = (a: number, b: number) => {
  if (a === b) {
    return 0;
  }
  return 1;
};

export const discrete2d = (x1: number, y1: number, x2: number, y2: number) => {
  return discrete(x1 - x2, y1 - y2);
};


export const britishRail = (a: number, b: number) => {
  if (a === b) {
    return 0;
  }
  return Math.abs(a) + Math.abs(b);
};

export const britishRail2d = (x1: number, y1: number, x2: number, y2: number) => {
  return britishRail(x1 - x2, y1 - y2);
};

export const superellipse = (x: number, y: number, a = 1, b = 1, n = 0.5) => {
  return Math.pow(Math.abs(x) / a, n) + Math.pow(Math.abs(y) / b, n);
};

export const superellipse2d = (x1: number, y1: number, x2: number, y2: number, a = 1, b = 1, n = 0.5) => {
  return superellipse(x1 - x2, y1 - y2, a, b, n);
};

export const makeSuperellipse = (a = 1, b = 1, n = 0.5) => {
  return (x: number, y: number) => superellipse(x, y, a, b, n);
};

export const makeSuperellipse2d = (a = 1, b = 1, n = 0.5) => {
  return (x1: number, y1: number, x2: number, y2: number) => superellipse2d(x1, y1, x2, y2, a, b, n);
};


export const canberra = (x: number, y: number) => {
  return Math.abs(x - y) / (Math.abs(x) + Math.abs(y));
};

export const canberra2d = (x1: number, y1: number, x2: number, y2: number) => {
  return canberra(x1, y1) + canberra(x2, y2);
};

export const cosine = (x: number, y: number) => { // cosine similarity = dot product
  return x * y;
};

export const cosine2d = (x1: number, y1: number, x2: number, y2: number) => {
  return x1 * y1 + x2 * y2;
};
