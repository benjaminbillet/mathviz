export const circularDistance = (current, next, mod) => {
  return Math.min(forwardCircularDistance(current, next, mod), backwardCircularDistance(current, next, mod));
};

export const forwardCircularDistance = (current, next, mod) => {
  if (next >= current) {
    return next - current;
  }
  return next + mod - current;
};

export const backwardCircularDistance = (current, next, mod) => {
  return forwardCircularDistance(next, current, mod);
};

export const manhattan = (a, b) => {
  return Math.abs(a) + Math.abs(b);
};

export const manhattan2d = (x1, y1, x2, y2) => {
  return manhattan(x1 - x2, y1 - y2);
};

/* export const manhattanNd = (p, q) => {
  return p.reduce((d, pi, i) => d + Math.abs(pi - q[i]), 0);
};*/


export const euclidean = (a, b) => {
  return Math.sqrt(a * a + b * b);
};

export const euclidean2d = (x1, y1, x2, y2) => {
  return euclidean(x1 - x2, y1 - y2);
};

export const chebyshev = (a, b) => {
  return Math.max(Math.abs(a), Math.abs(b));
};

export const chebyshev2d = (x1, y1, x2, y2) => {
  return chebyshev(x1 - x2, y1 - y2);
};


export const minkowski = (a, b) => {
  return Math.abs(a - b);
};

export const minkowski2d = (x1, y1, x2, y2, p) => {
  return Math.pow(Math.pow(Math.abs(x1 - x2), p) + Math.pow(Math.abs(y1 - y2), p), 1/p);
};

export const makeMinkowski2d = (p) => {
  return (x1, y1, x2, y2) => minkowski2d(x1, y1, x2, y2, p);
};

export const karlsruhe2d = (x1, y1, x2, y2) => {
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

export const akritean2d = (x1, y1, x2, y2, a) => {
  return euclidean2d(x1, y1, x2, y2) * (1 - a) + manhattan2d(x1, y1, x2, y2) * a;
};

export const makeAkritean2d = (a) => {
  return (x1, y1, x2, y2) => akritean2d(x1, y1, x2, y2, a);
};


export const discrete = (a, b) => {
  if (a === b) {
    return 0;
  }
  return 1;
};

export const discrete2d = (x1, y1, x2, y2) => {
  return discrete(x1 - x2, y1 - y2);
};


export const britishRail = (a, b) => {
  if (a === b) {
    return 0;
  }
  return Math.abs(a) + Math.abs(b);
};

export const britishRail2d = (x1, y1, x2, y2) => {
  return britishRail(x1 - x2, y1 - y2);
};

