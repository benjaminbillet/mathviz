import { clamp } from '../../utils/misc';
import { ReactDiffuseFunction } from '../../utils/types';

export type GrayScottState = {
  a: number,
  b: number,
};

export const GRAY_SCOTT_KERNEL = [
  0.05,  0.2, 0.05,
  0.2,  -1,   0.2,
  0.05,  0.2, 0.05,
];

export const makeGrayScott = (f: number, k: number, da: number, db: number, dt = 1): ReactDiffuseFunction<GrayScottState> => {
  return (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
    const { a, b } = currentState;

    // convolution, see http://www.karlsims.com/rd.html
    let laplacianA = 0;
    let laplacianB = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const x2 = x + i;
        const y2 = y + j;
        if (x2 < 0 || x2 >= gridWidth || y2 < 0 || y2 >= gridHeight) {
          return { a: 1, b: 0 };
        }

        const st = stateGrid[x2 + y2 * gridWidth]
        const k = GRAY_SCOTT_KERNEL[(i + 1 + (j + 1) * 3)];
        laplacianA += st.a * k;
        laplacianB += st.b * k;
      }
    } 

    const abb = a * b * b;
    const newA = clamp(a + (da * laplacianA - abb + f * (1 - a)) * dt, 0, 1);
    const newB = clamp(b + (db * laplacianB + abb - (k + f) * b) * dt, 0, 1);

    return { a: newA, b: newB };
  };
};

export type GrayScottParams = {
  f: number,
  k: number,
  da: number,
  db: number,
  diffusionKernel: number[],
};

export const makeAdvancedGrayScott = (getParams: (x: number, y: number) => GrayScottParams, dt = 1): ReactDiffuseFunction<GrayScottState> => {
  return (stateGrid, gridWidth, gridHeight, currentState, x, y) => {
    const { a, b } = currentState;
    const { f, k, da, db, diffusionKernel } = getParams(x, y);

    // convolution, see http://www.karlsims.com/rd.html
    let laplacianA = 0;
    let laplacianB = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const x2 = x + i;
        const y2 = y + j;
        if (x2 < 0 || x2 >= gridWidth || y2 < 0 || y2 >= gridHeight) {
          return { a: 1, b: 0 };
        }

        const st = stateGrid[x2 + y2 * gridWidth]
        const k = diffusionKernel[(i + 1 + (j + 1) * 3)];
        laplacianA += st.a * k;
        laplacianB += st.b * k;
      }
    }

    const abb = a * b * b;
    const newA = clamp(a + (da * laplacianA - abb + f * (1 - a)) * dt, 0, 1);
    const newB = clamp(b + (db * laplacianB + abb - (k + f) * b) * dt, 0, 1);

    return { a: newA, b: newB };
  };
};
