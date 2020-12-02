export const zeros = (rows: number, cols: number): Matrix => {
  return new Matrix(rows, cols);
};

export const mat2d = (rows: number, cols: number): Matrix => {
  return zeros(rows, cols);
};

export const sqMat2d = (n: number): Matrix => {
  return mat2d(n, n);
};

export const fill = (m: Matrix, v = 0): Matrix => {
  m.data.fill(v);
  return m;
};

export const get = (m: Matrix, row: number, col: number): number => {
  if (row >= m.rows || col >= m.cols) {
    throw new Error('matrix out of bound');
  }
  return m.data[col + row * m.cols];
};

export const set = (m: Matrix, row: number, col: number, v: number): void => {
  if (row >= m.rows || col >= m.cols) {
    throw new Error('matrix out of bound');
  }
  m.data[col + row * m.cols] = v;
};

export const add = (m1: Matrix, m2: Matrix, out?: Matrix): Matrix => {
  if (m1.cols !== m2.cols || m1.rows !== m2.cols) {
    throw new Error('incompatible matrix size');
  }
  if (out == null) {
    out = new Matrix(m1.rows, m1.cols);
  }
  out.data = m1.data.map((x, i) => x + m2.data[i]);
  return out;
};

export const sub = (m1: Matrix, m2: Matrix, out?: Matrix): Matrix => {
  if (m1.cols !== m2.cols || m1.rows !== m2.cols) {
    throw new Error('incompatible matrix size');
  }
  if (out == null) {
    out = new Matrix(m1.rows, m1.cols);
  }
  out.data = m1.data.map((x, i) => x - m2.data[i]);
  return out;
};

export const mul = (m1: Matrix, m2: Matrix | number, out?: Matrix): Matrix => {
  if (typeof m2 === 'number') {
    return nmul(m1, m2);
  }
  if (m1.cols !== m2.rows) {
    throw new Error('incompatible matrix size');
  }
  if (out == null) {
    out = new Matrix(m1.rows, m2.cols);
  }
  for (let i = 0; i < out.rows; i++) {
    for (let j = 0; j < out.cols; j++) {
      let v = 0;
      for (let k = 0; k < m1.cols; k++) {
        v += m1.data[k + i * out.cols] * m2.data[j + k * out.cols];
      }
      out.data[j + i * out.cols] = v;
    }
  }
  return out;
};

const nmul = (m: Matrix, n: number, out?: Matrix): Matrix => {
  if (out == null) {
    out = new Matrix(m.rows, m.cols);
  }
  out.data = m.data.map(x => n * x);
  return out;
};

export const transpose = (m: Matrix, out?: Matrix): Matrix => {
  if (out == null) {
    out = new Matrix(m.cols, m.rows);
  }
  for (let i = 0; i < m.rows; i++) {
    for (let j = 0; j < m.cols; j++) {
      out.data[i + j * out.cols] = m.data[j + i * m.cols];
    }
  }
  return out;
};

export class Matrix {
  rows: number;
  cols: number;
  data: Float32Array;

  constructor(rows: number, cols: number, values?: Float32Array | number[]) {
    this.rows = rows;
    this.cols = cols;
    if (values != null) {
      if (values.length != rows * cols) {
        throw new Error('Invalid matrix initializer');
      }
      this.data = new Float32Array(values);
    } else {
      this.data = new Float32Array(rows * cols).fill(0);
    }
  }

  set(row: number, col: number, v: number): void {
    set(this, row, col, v);
  }

  get(row: number, col: number): number {
    return get(this, row, col);
  }
  
  add(m: Matrix, out?: Matrix): Matrix {
    return add(this, m, out);
  }
  
  sub(m: Matrix, out?: Matrix): Matrix {
    return sub(this, m, out);
  }

  mul(m: Matrix, out?: Matrix): Matrix {
    return mul(this, m, out);
  }
  
  transpose(out?: Matrix): Matrix {
    return transpose(this, out);
  }

  toString(): string {
    const arr = [];
    for (let i = 0; i < this.rows; i++) {
      const arr2 = [];
      for (let j = 0; j < this.cols; j++) {
        arr2.push(this.data[j + i * this.cols]);
      }
      arr.push(arr2);
    }
    return `[[${arr.join('], [')}]]`;
  }
}
