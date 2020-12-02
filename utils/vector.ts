export const dot2 = (x1: number, y1: number, x2: number, y2: number): number => {
  return x1 * x2 + y1 * y2;
};

export const det2 = (x1: number, y1: number, x2: number, y2: number): number => {
  return x1 * y2 - y1 * x2;
};

export const dot3 = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number => {
  return x1 * x2 + y1 * y2 + z1 * z2;
};

export const cross3 = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number[] => {
  return [
    y1 * z2 - z1 * y2,
    z1 * x2 - x1 * z2,
    x1 * y2 - y1 * x2,
  ];
};

export const normal3 = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, x3: number, y3: number, z3: number): number[] => {
  const v = cross3(x2 - x1, y2 - y1, z2 - z1, x3 - x1, y3 - y1, z3 - z1);
  return normalize3(v[0], v[1], v[2]);
};

export const norm3 = (x1: number, y1: number, z1: number): number => {
  return Math.sqrt(x1 * x1 + y1 * y1 + z1 * z1);
};

export const normalize3 = (x1: number, y1: number, z1: number): number[] => {
  if (x1 === 0 && y1 === 0 && z1 === 0) {
    return [ 0, 0, 0 ];
  }
  const norm = norm3(x1, y1, z1);
  return [ x1 / norm, y1 / norm, z1 / norm ];
};
