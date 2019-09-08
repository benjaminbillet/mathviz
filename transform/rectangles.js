import { complex } from '../utils/complex';
import { randomScalar } from '../utils/random';

export const makeRectanglesFunction = (px, py) => {
  return (z) => {
    return complex(
      px * (2 * Math.floor(z.re * px) + 1) - z.re,
      py * (2 * Math.floor(z.im * py) + 1) - z.im,
    );
  };
};

export const makeRectangles = () => {
  const px = randomScalar(-1, 1);
  const py = randomScalar(-1, 1);  console.log(`makeRectanglesFunction(${px}, ${py})`);
  return makeRectanglesFunction(px, py);
};
