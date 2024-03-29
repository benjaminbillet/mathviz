import { randomScalar } from '../utils/random';
import { complex } from '../utils/complex';
import { Transform2D } from '../utils/types';

export const makeSplitFunction = (px: number, py: number): Transform2D => {
  return (z) => {
    const result = complex(z.re, z.im);
    if (z.re >= 0) {
      result.re += px;
    } else {
      result.re -= px;
    }

    if (z.im >= 0) {
      result.im += py;
    } else {
      result.im -= py;
    }

    return result;
  };
};

export const makeSplit = () => {
  const px = randomScalar(-1, 1);
  const py = randomScalar(-1, 1);
  console.log(`makeSplitFunction(${px}, ${py})`);
  return makeSplitFunction(px, py);
};
