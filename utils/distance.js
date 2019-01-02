export const circularDistance = (current, next, mod) => {
  if (next >= current) {
    return next - current;
  }
  return next + mod - current;
};

export const circularCounterDistance = (current, next, mod) => {
  return -1 * circularDistance(next, current, mod);
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
