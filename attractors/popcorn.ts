import { complex } from '../utils/complex';
import { Attractor } from '../utils/types';

export const makePopcorn = (h: number): Attractor => {
  return (z) => complex(z.re - h * Math.sin(z.im + Math.tan(3 * z.im)), z.im - h * Math.sin(z.re + Math.tan(3 * z.re)));
};
