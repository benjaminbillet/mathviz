import { complex } from '../utils/complex';

export const makeBubbleFunction = () => {
  return (z) => {
    const r2 = z.re * z.re + z.im * z.im;
    const factor = 4 / (r2 + 4);
    return complex(factor * z.re, factor * z.im);
  };
};

export const makeBubble = () => {
  console.log('makeBubbleFunction()');
  return makeBubbleFunction();
};
