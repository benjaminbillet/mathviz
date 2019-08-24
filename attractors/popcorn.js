import { complex } from '../utils/complex';

export const makePopcorn = (h) => {
  return (z) => complex(z.re - h * Math.sin(z.im + Math.tan(3 * z.im)), z.im - h * Math.sin(z.re + Math.tan(3 * z.re)));
};
